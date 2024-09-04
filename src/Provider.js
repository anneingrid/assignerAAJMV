import React, { createContext, useState } from 'react';
import { supabase } from './ConexaoBd';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    async function gerarHash(text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-512', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    async function gerarAssinatura(idDocumento, idUsuario, text) {
        try {
            const hash = await gerarHash(text);
            console.log('Hash gerado:', hash);

            const { data, error } = await supabase
                .from('assinaturas')
                .insert([
                    {
                        id_documento: idDocumento,
                        id_usuario: idUsuario,
                        assinatura_hash: hash,
                    },
                ]);

            console.log('Dados retornados pelo Supabase:', data);
            if (error) {
                console.error('Erro ao inserir a assinatura:', error.message || error);
                return null;
            }

            console.log('Assinatura criada com sucesso:', data);
            return data;
        } catch (error) {
            console.error('Erro ao gerar a assinatura:', error.message || error);
            return null;
        }
    }

    async function gerarChaves(idUsuario) {
        try {
            const keyPair = await window.crypto.subtle.generateKey(
                {
                    name: "RSA-PSS",
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                    hash: "SHA-256",
                },
                true,
                ["sign", "verify"]
            );

            const publicKey = await window.crypto.subtle.exportKey(
                "spki",
                keyPair.publicKey
            );
            const privateKey = await window.crypto.subtle.exportKey(
                "pkcs8",
                keyPair.privateKey
            );

            const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
            const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));

            const { data, error } = await supabase
                .from('usuarios')
                .update([
                    {
                        chave_publica: publicKeyBase64,
                        chave_privada: privateKeyBase64,
                    }])
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
                .select(`
                id_documento,
                documentos (*)`)
                .eq('id_usuario', idUsuario)
            if (error) {
                console.error("Erro ao buscar documentos assinados:", error)
                return []
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
        
          const { data: assinaturas, error: erroAssinaturas} = await supabase
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
        <AppContext.Provider value={{ gerarHash, gerarAssinatura, gerarChaves, listarDocumentosAssinados, listarDocumentosNaoAssinados }}>
            {children}
        </AppContext.Provider>
    );
};