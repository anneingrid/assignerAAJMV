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


    return (
        <AppContext.Provider value={{ gerarHash, gerarAssinatura }}>
            {children}
        </AppContext.Provider>
    );
};
