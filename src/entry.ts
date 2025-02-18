import component, * as namedExports from './entry.esm.ts';

Object.entries(namedExports).forEach(([exportName, exported]) => {
    if (exportName !== 'default') component[exportName] = exported;
});

export default component;
