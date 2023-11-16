const fs = require('fs')


const files: string[] = ['features', 'pages/webPages', 'pages/basePages/BasePage.js', 'steps/editor', 'utils/web-utils']
// const files = ['steps']
const prefix = '../workstation-attribute-editor/tests/acceptance'

const isDirectory = (file: string) => {
    return fs.statSync(file).isDirectory();
}

const getFilesWithPrefix = (files: string[]) => {
    return files.map((file) => {
        return `${prefix}/${file}`
    })
}

const getStrFromFiles = (files: string[]): string => {
    return files.reduce((acc, file) => {
        const isDir = isDirectory(file)
        if(isDir) {
            const dirFiles = fs.readdirSync(file)
            const dirFilesPath = dirFiles.map((dirFile: string) => {
                return `${file}/${dirFile}`
            })
            return acc + getStrFromFiles(dirFilesPath)
        }else {
            const fileContent = fs.readFileSync(file, 'utf-8')
            return acc + fileContent
        }
    }, '');
}

// const minimize = (str) => {
// return str.replace(/\s+/g, ' ')
// }
const minimize = (str: string) => {
    // Remove comments
    str = str.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'');
    // // Shorten variable names
    // let variableIndex = 0;
    // str = str.replace(/(\bvar\b|\blet\b|\bconst\b)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/g, (match, p1, p2) => {
    //     return `${p1} v${variableIndex++}`;
    // });
    // Remove unnecessary characters
    str = str.replace(/;\s*}/g, '}');
    // Replace multiple spaces with a single space
    str = str.replace(/\s+/g, ' ');
    return str;
};

const prompt = minimize(getStrFromFiles(['./prompt.txt']))

const str = minimize(getStrFromFiles([...getFilesWithPrefix(files),]))

console.log(str)

export { str, prompt }