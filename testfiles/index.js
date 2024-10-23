import a from './a.js';

const _fun = async ()=>{
    const _a = a();
    const _b = await import('./b.js')

    console.log(_a, _b.default());
}

_fun()