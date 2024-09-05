import React, { createContext, useState, useEffect } from 'react';
import { supabase } from './ConexaoBd';
import bcrypt from 'bcryptjs';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (usuario) {
            setUsuarioLogado(usuario);
        }
        console.log('Usuário carregado do localStorage:', usuario);

    }, []);
    
    const salvarUsuarioNoLocalStorage = (usuario) => {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    };

    async function gerarHash(text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-512', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }


    async function hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async function cadastrarUsuario(nome, email, senha) {
        try {
            const hashedPassword = await hashPassword(senha);

            const { data, error } = await supabase
                .from('usuarios')
                .insert([{ nome_usuario: nome, email: email, senha: hashedPassword }]);

            if (error) {
                console.error('Erro ao cadastrar o usuário:', error.message || error);
                return { error: 'Erro ao cadastrar o usuário. Tente novamente.' };
            }

            return { success: 'Usuário cadastrado com sucesso!' };
        } catch (error) {
            console.error('Erro no processo de cadastro:', error.message || error);
            return { error: 'Erro no processo de cadastro. Tente novamente.' };
        }
    }

    async function login(email, password) {
        try {
            const { data: usuario, error: fetchError } = await supabase
                .from('usuarios')
                .select('id_usuario, nome_usuario, senha')
                .eq('email', email)
                .single();

            if (fetchError || !usuario) {
                return { error: 'Usuário não encontrado.' };
            }

            const isPasswordCorrect = bcrypt.compareSync(password, usuario.senha);

            if (!isPasswordCorrect) {
                return { error: 'Senha incorreta.' };
            }

            setUsuarioLogado(usuario);
            salvarUsuarioNoLocalStorage(usuario); // Salva no localStorage

            return { success: true, usuario };
        } catch (error) {
            console.error('Erro durante o login:', error);
            return { error: 'Erro durante o login. Tente novamente.' };
        }
    }

    async function gerarAssinatura(idDocumento, idUsuario, text) {
        try {
            const hash = await gerarHash(text);
            const { data, error } = await supabase
                .from('assinaturas')
                .insert([{ id_documento: idDocumento, id_usuario: idUsuario, assinatura_hash: hash }]);
            if (error) {
                console.error('Erro ao inserir a assinatura:', error.message || error);
                return null;
            }
            return data;
        } catch (error) {
            console.error('Erro ao gerar a assinatura:', error.message || error);
            return null;
        }
    }

    async function gerarChaves(idUsuario) {
        try {
            const keyPair = await window.crypto.subtle.generateKey(
                { name: "RSA-PSS", modulusLength: 2048, publicExponent: new Uint8Array([0x01, 0x00, 0x01]), hash: "SHA-256" },
                true,
                ["sign", "verify"]
            );
            const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
            const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

            const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
            const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));

            const { data, error } = await supabase
                .from('usuarios')
                .update([{ chave_publica: publicKeyBase64, chave_privada: privateKeyBase64 }])
                .match({ id_usuario: idUsuario });

            if (error) {
                console.error('Erro ao armazenar as chaves:', error.message || error);
                return null;
            }

            return data;

        } catch (error) {
            console.error('Erro ao gerar o par de chaves:', error.message || error);
            return null;
        }
    }

    async function listarDocumentosAssinados(idUsuario) {
        try {
            const { data, error } = await supabase
                .from('assinaturas')
                .select(`id_documento, documentos (*)`)
                .eq('id_usuario', idUsuario);
            if (error) {
                console.error("Erro ao buscar documentos assinados:", error);
                return [];
            }
            return data;
        } catch (error) {
            console.error('Erro ao listar documentos assinados:', error.message || error);
            return null;
        }
    }

    async function listarDocumentosNaoAssinados(idUsuario) {
        try {
            const { data: documentos, error: erroDocumentos } = await supabase
                .from('documentos')
                .select('*')
                .eq('id_usuario', idUsuario);

            if (erroDocumentos) {
                console.error("Erro ao buscar documentos:", erroDocumentos);
                return [];
            }

            const { data: assinaturas, error: erroAssinaturas } = await supabase
                .from('assinaturas')
                .select('*')
                .eq('id_usuario', idUsuario);

            if (erroAssinaturas) {
                console.error("Erro ao buscar assinaturas:", erroAssinaturas);
                return [];
            }

            const idDocumentoAssinaturas = assinaturas.map(doc => doc.id_documento);

            const documentosNaoAssinados = documentos.filter(doc => !idDocumentoAssinaturas.includes(doc.id_documento));

            return documentosNaoAssinados;

        } catch (error) {
            console.error('Erro ao listar documentos não assinados:', error.message || error);
            return null;
        }
    }

    return (
        <AppContext.Provider value={{ login,cadastrarUsuario,usuarioLogado, gerarHash, gerarAssinatura, gerarChaves, listarDocumentosAssinados, listarDocumentosNaoAssinados }}>
            {children}
        </AppContext.Provider>
    );
};
