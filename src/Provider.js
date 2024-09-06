import React, { createContext, useState, useEffect } from 'react';
import { supabase } from './ConexaoBd';
import bcrypt from 'bcryptjs';
import forge from 'node-forge';
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
            const privateKeyPem = await buscarChave(idUsuario);

            if (!privateKeyPem) {
                throw new Error('Chave privada não encontrada ou inválida');
            }

            const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
            const md = forge.md.sha512.create();
            md.update(text, 'utf8');
            const signature = privateKey.sign(md);
console.log(forge.util.encode64(signature))

            const now = new Date();
            const localTime = now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

            const { data, error } = await supabase
                .from('assinaturas')
                .insert([{
                    id_documento: idDocumento,
                    id_usuario: idUsuario,
                    assinatura_hash: md.digest().toHex(),
                    assinatura: forge.util.encode64(signature),
                    assinado_em: localTime
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
            const { data: buscaUsuario, error: erroBuscaUsuario } = await supabase
                .from('usuarios')
                .select('chave_privada, chave_publica')
                .eq('id_usuario', idUsuario);



            const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });

            const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
            const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);

            const { data, error } = await supabase
                .from('usuarios')
                .update({ chave_publica: publicKeyPem, chave_privada: privateKeyPem })
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

            const privateKey = (data[0].chave_privada);
            console.log(privateKey);
            return privateKey;
        } catch (error) {
            console.error('Erro ao buscar chave privada', error.message || error);
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
                console.error('Erro ao buscar chave pública', error);
                return null;
            }

            const publicKey = (data[0].chave_publica);
            return publicKey;
        } catch (error) {
            console.error('Erro ao importar chave pública', error.message || error);
            return null;
        }
    };

    const salvarDocumento = async (idUsuario, text) => {
        const hash = forge.md.sha512.create();
        hash.update(text);
        const hashHex = hash.digest().toHex();

        try {
            const now = new Date();
            const localTime = now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

            const { data, error } = await supabase
                .from('documentos')
                .insert([{
                    id_usuario: idUsuario,
                    mensagem_documento: text,
                    documento_hash: hashHex,
                    criado_em: localTime
                }])
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
                .select('assinatura, assinatura_hash, documentos(*)')
                .eq('id_documento', id_documento)
                .eq('id_usuario', id_usuario)
                .single();

            if (assinaturaError) {
                console.error("Erro ao buscar assinatura:", assinaturaError);
                return false;
            }
            
            const texto = assinaturaData.documentos.mensagem_documento;
            const signature = assinaturaData.assinatura;
            console.log(signature)
            const assinaturaHash = assinaturaData.assinatura_hash;
            const publicKeyPem = await buscarChavePublica(id_usuario);
            
            if (!publicKeyPem) {
                console.error("Erro ao buscar chave pública.");
                return false;
            }
            const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
            const md = forge.md.sha512.create();
            md.update(texto, 'utf8');
            const digestHex = md.digest().toHex();

            if (digestHex !== assinaturaHash) {
                console.error("Hash do documento não corresponde ao hash da assinatura.");
                return false;
            }
            const decodedSignature = forge.util.decode64(signature);
            console.log(decodedSignature);
            const verified = publicKey.verify(md.digest().bytes(), decodedSignature);

            console.log("Resultado da verificação:", verified);
            return verified;

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
