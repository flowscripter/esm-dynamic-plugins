import cleanup from 'rollup-plugin-cleanup';
import commonjs from 'rollup-plugin-commonjs';
import { eslint } from 'rollup-plugin-eslint';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import ts from 'typescript';
import tempDir from 'temp-dir';

module.exports = {
    input: {
        index: 'src/index.ts',
        Plugin: 'src/Plugin.ts',
        PluginManager: 'src/PluginManager.ts'
    },
    output: {
        dir: 'dist',
        format: 'es',
        entryFileNames: '[name].mjs'
    },
    watch: {
        include: 'src/**',
    },
    plugins: [
        peerDepsExternal(),
        eslint({
            include: [
                'src/**/*.ts'
            ]
        }),
        typescript({
            typescript: ts,
            useTsconfigDeclarationDir: true,
            cacheRoot: `${tempDir}/.rpt2_cache`
        }),
        commonjs(),
        resolve(),
        cleanup({extensions: ['ts']})
    ]
};
