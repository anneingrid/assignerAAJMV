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
            const privateKey = await buscarChave(idUsuario);

            if (!privateKey) {
                throw new Error('Chave privada não encontrada ou inválida');
            }

            const textBuffer = new TextEncoder().encode(text);

            let signature = await window.crypto.subtle.sign(
                {
                    name: "RSA-PSS",
                    saltLength: 32,
                },
                privateKey,
                textBuffer
            );

            console.log('Assinatura gerada:', new Uint8Array(signature));

            const { data, error } = await supabase
                .from('assinaturas')
                .insert([
                    {
                        id_documento: idDocumento,
                        id_usuario: idUsuario,
                        assinatura_hash: hash,
                    },
                ]);

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
                .select(`*, documentos (*)`)
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
    async function buscarChave(idUsuario) {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('chave_privada')
                .eq('id_usuario', idUsuario);

            if (error || !data.length) {
                console.error('Erro ao buscar chaves', error);
                return null;
            }

            const chavePrivadaBase64 = data[0].chave_privada;
            const chavePrivadaBuffer = Uint8Array.from(atob(chavePrivadaBase64), c => c.charCodeAt(0)).buffer;

            const privateKey = await window.crypto.subtle.importKey(
                'pkcs8',
                chavePrivadaBuffer,
                {
                    name: 'RSA-PSS',
                    hash: { name: 'SHA-256' }
                },
                true,
                ['sign']
            );

            return privateKey;
        } catch (error) {
            console.error('Erro ao importar chave privada', error.message || error);
            return null;
        }
    }

    async function salvarDocumento(idUsuario, text) {
        const hash = await gerarHash(text);
        try {
            const { data, error } = await supabase
                .from('documentos')
                .insert([
                    {
                        id_usuario: idUsuario,
                        mensagem_documento: text,
                        documento_hash: hash
                    }

                ])
                .select()
            if (error) {
                console.error('Erro ao salvar documento', error.message || error);
                return null;
            }
            if (data && data.length > 0) {
                const idDocumento = data[0].id_documento; // Acessa o id_documento do primeiro item
                return idDocumento;
            } else {
                console.error('Nenhum dado foi retornado após salvar o documento.');
                return null;
            }
        } catch (error) {
            console.error('Erro ao salvar documento', error.message || error);
            return null;
        }

    }
    return (
        <AppContext.Provider value={{ salvarDocumento, login, cadastrarUsuario, usuarioLogado, gerarHash, gerarAssinatura, gerarChaves, listarDocumentosAssinados, listarDocumentosNaoAssinados }}>
            {children}
        </AppContext.Provider>
    );
};
