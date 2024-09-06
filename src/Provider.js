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
    }, []);

    const salvarUsuarioNoLocalStorage = (usuario) => {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    };

    const base64ToArrayBuffer = (base64) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };



    const gerarHash = async (text) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-512', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    const hashPassword = async (password) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    };

    const cadastrarUsuario = async (nome, email, senha) => {
        try {
            const { data: nomeExistente } = await supabase
                .from('usuarios')
                .select('*')
                .eq('nome_usuario', nome)
                .single();
    
            if (nomeExistente) {
                return { error: 'Nome de usuário já está em uso. Escolha outro.' };
            }
    
            const { data: emailExistente } = await supabase
                .from('usuarios')
                .select('*')
                .eq('email', email)
                .single();
    
            if (emailExistente) {
                return { error: 'E-mail já está em uso. Escolha outro.' };
            }
    
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
    };
    
    

    const login = async (email, password) => {
        try {
            const { data: usuario, error: fetchError } = await supabase
                .from('usuarios')
                .select('id_usuario, nome_usuario, senha')
                .eq('email', email)
                .single();
    
            if (fetchError || !usuario) {
                localStorage.removeItem('usuarioLogado');
                return { error: 'Usuário não encontrado.' };
            }
    
            const isPasswordCorrect = bcrypt.compareSync(password, usuario.senha);
    
            if (!isPasswordCorrect) {
                return { error: 'Senha incorreta.' };
            }
    
            setUsuarioLogado(usuario);
            salvarUsuarioNoLocalStorage(usuario);
    
            return { success: true, usuario };
        } catch (error) {
            console.error('Erro durante o login:', error.message || error);
            localStorage.removeItem('usuarioLogado');
            return { error: 'Erro durante o login. Tente novamente.' };
        }
    };
    
    const logout = () => {
        setUsuarioLogado(null);
        localStorage.removeItem('usuarioLogado');
      };
    
      
    const gerarAssinatura = async (idDocumento, idUsuario, text) => {
        try {
            const hash = await gerarHash(text);
            const privateKey = await buscarChave(idUsuario);

            if (!privateKey) {
                throw new Error('Chave privada não encontrada ou inválida');
            }
            
            const enc = new TextEncoder().encode(text);
            const signature = await window.crypto.subtle.sign(
                {
                    name: "RSA-PSS",
                    saltLength: 32
                },
                privateKey,
                enc
            );

            const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

            const { data, error } = await supabase
                .from('assinaturas')
                .insert([{
                    id_documento: idDocumento,
                    id_usuario: idUsuario,
                    assinatura_hash: hash,
                    assinatura: signature
                }]);

            if (error) {
                console.error('Erro ao inserir a assinatura:', error.message || error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Erro ao gerar a assinatura:', error.message || error);
            return null;
        }
    };

    const gerarChaves = async (idUsuario) => {
        try {

            const mensagemDeErro = 'erro'

            const { data: buscaUsuario, erro:erroBuscaUsuario } = await supabase
            .from('usuarios')
            .select('chave_privada, chave_publica')
            .eq('id_usuario', idUsuario);

            if (buscaUsuario[0].chave_privada && buscaUsuario[0].chave_publica){
                return mensagemDeErro;
            } 
            else {
                const keyPair = await window.crypto.subtle.generateKey(
                    {
                        name: "RSA-PSS",
                        modulusLength: 2048,
                        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                        hash: "SHA-512"
                    },
                    true,
                    ["sign", "verify"]
                );
    
                const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
                const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    
                const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
                const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));
    
                const { data, error } = await supabase
                    .from('usuarios')
                    .update({ chave_publica: publicKeyBase64, chave_privada: privateKeyBase64 })
                    .match({ id_usuario: idUsuario });
    
                if (error) {
                    console.error('Erro ao armazenar as chaves:', error.message || error);
                    return null;
                }
                
                return data;
            }
        } catch (error) {
            console.error('Erro ao gerar o par de chaves:', error.message || error);
            return null;
        }
    };

    const listarDocumentosAssinados = async (idUsuario) => {
        try {
            const { data, error } = await supabase
                .from('assinaturas')
                .select('*, documentos(*), usuarios(nome_usuario)')
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
    };

    const listarDocumentosNaoAssinados = async (idUsuario) => {
        try {
            const { data: documentos, error: erroDocumentos } = await supabase
                .from('documentos')
                .select('*, usuarios(nome_usuario)')
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
    
            const idDocumentosAssinados = assinaturas.map(assinatura => assinatura.id_documento);
    
            const documentosNaoAssinados = documentos.filter(doc => !idDocumentosAssinados.includes(doc.id_documento));
    
            return documentosNaoAssinados;
        } catch (error) {
            console.error('Erro ao listar documentos não assinados:', error.message || error);
            return null;
        }
    };

    const buscarChave = async (idUsuario) => {
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
            const chavePrivadaBuffer = base64ToArrayBuffer(chavePrivadaBase64);

            const privateKey = await window.crypto.subtle.importKey(
                'pkcs8',
                chavePrivadaBuffer,
                { name: 'RSA-PSS', hash: { name: 'SHA-256' } },
                true,
                ['sign']
            );

            return privateKey;
        } catch (error) {
            console.error('Erro ao importar chave privada', error.message || error);
            return null;
        }
    };

    const buscarChavePublica = async (idUsuario) => {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('chave_publica')
                .eq('id_usuario', idUsuario);

            if (error || !data.length) {
                console.error('Erro ao buscar chaves', error);
                return null;
            }

            const chavePublicaBase64 = data[0].chave_publica;
            const chavePublicaBuffer = base64ToArrayBuffer(chavePublicaBase64);

            const publicKey = await window.crypto.subtle.importKey(
                'spki',
                chavePublicaBuffer,
                { name: 'RSA-PSS', hash: { name: 'SHA-256' } },
                true,
                ['verify']
            );

            return publicKey;
        } catch (error) {
            console.error('Erro ao importar chave pública', error.message || error);
            return null;
        }
    };

    const salvarDocumento = async (idUsuario, text) => {
        const hash = await gerarHash(text);
        try {
            const { data, error } = await supabase
                .from('documentos')
                .insert([{ id_usuario: idUsuario, mensagem_documento: text, documento_hash: hash }])
                .select();

            if (error) {
                console.error('Erro ao salvar documento', error.message || error);
                return null;
            }

            if (data && data.length > 0) {
                return data[0].id_documento;
            } else {
                console.error('Nenhum dado foi retornado após salvar o documento.');
                return null;
            }
        } catch (error) {
            console.error('Erro ao salvar documento', error.message || error);
            return null;
        }
    };

    const verificarAssinatura = async (id_documento, id_usuario) => {
        try {
            const { data: assinaturaData, error: assinaturaError } = await supabase
                .from('assinaturas')
                .select('assinatura, assinatura_hash, documentos(documento_hash)')
                .eq('id_documento', id_documento)
                .eq('id_usuario', id_usuario)
                .single();

            if (assinaturaError) {
                console.error("Erro ao buscar assinatura:", assinaturaError);
                return false;
            }

            const signatureBase64 = assinaturaData.assinatura;
            const documentoHash = assinaturaData.documentos.mensagem_documento;
            const publicKey = await buscarChavePublica(id_usuario);

            if (!publicKey) {
                console.error("Erro ao importar a chave pública.");
                return false;
            }
          
            const encoded = new TextEncoder().encode(documentoHash);
            const signatureArrayBuffer = base64ToArrayBuffer(signatureBase64);

            const result = await window.crypto.subtle.verify(
                { name: "RSA-PSS", saltLength: 32 },
                publicKey,
                signatureBase64,
                encoded
            );

            return result;
        } catch (error) {
            console.error('Erro ao verificar assinatura:', error.message || error);
            return false;
        }
    };

    const listarTodosDocumentosAssinados = async () => {
        try {
            const { data, error } = await supabase
                .from('assinaturas')
                .select('*, usuarios(nome_usuario), documentos (*)');

            if (error) {
                console.error("Erro ao buscar documentos assinados:", error);
                return [];
            }
            return data;
        } catch (error) {
            console.error('Erro ao listar documentos assinados:', error.message || error);
            return null;
        }
    };

    const listarTodosDocumentosNaoAssinados = async () => {
        try {
            const { data: documentos, error: erroDocumentos } = await supabase
                .from('documentos')
                .select('id_documento, mensagem_documento, criado_em, usuarios (nome_usuario)');     
            if (erroDocumentos) {
                console.error("Erro ao buscar documentos:", erroDocumentos);
                return [];
            }
    
            const { data: assinaturas, error: erroAssinaturas } = await supabase
                .from('assinaturas')
                .select('id_documento');
            
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
    };



    return (
        <AppContext.Provider value={{
            verificarAssinatura,
            salvarDocumento,
            login,
            cadastrarUsuario,
            usuarioLogado,
            gerarHash,
            gerarAssinatura,
            gerarChaves,
            listarDocumentosAssinados,
            listarDocumentosNaoAssinados,
            listarTodosDocumentosAssinados,
            listarTodosDocumentosNaoAssinados,
            logout
        }}>
            {children}
        </AppContext.Provider>
    );
};
