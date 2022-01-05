const osPath = require('path');
const path = require('path').posix;

function urlPathFromFilePath(filePath) {
    const pathObject = path.parse(filePath);
    const parts = pathObject.dir.split(path.sep).filter(Boolean);
    if (pathObject.name !== 'index') {
        parts.push(pathObject.name);
    }
    const urlPath = parts.join('/').toLowerCase();
    return '/' + urlPath;
}

function cssClassesFromUrlPath(urlPath) {
    const parts = urlPath
        .replace(/^\/|\/$/g, '')
        .split('/')
        .filter(Boolean);

    let css = 'page';
    return parts.map((part) => {
        css += `-${part}`;
        return css;
    });
}

function cssClassesFromFilePath(filePath) {
    const pathObject = path.parse(filePath);
    const parts = pathObject.dir.split(path.sep).filter(Boolean);
    parts.push(pathObject.name);

    let css = 'page';
    return parts.map((part) => {
        css += `-${part}`;
        return css;
    });
}

function flattenMarkdownData() {
    return ({ data }) => {
        const objects = data.objects.map((object) => {
            if ('frontmatter' in object) {
                return {
                    __metadata: object.__metadata,
                    ...object.frontmatter,
                    markdown_content: object.markdown || null
                };
            }
            return object;
        });

        return {
            ...data,
            objects
        };
    };
}

function convertPathToPosix(p) {
    if (osPath.sep === path.sep) {
        return p;
    }
    if (!p) {
        return p;
    }
    return p.split(osPath.sep).join(path.sep);
}

function normalizePaths({ data }) {
    return {
        ...data,
        objects: data.objects.map((object) => {
            if ('__metadata' in object) {
                const metadata = object.__metadata;
                return {
                    ...object,
                    __metadata: {
                        ...metadata,
                        id: convertPathToPosix(metadata.id),
                        sourcePath: convertPathToPosix(metadata.sourcePath),
                        relSourcePath: convertPathToPosix(metadata.relSourcePath),
                        relProjectPath: convertPathToPosix(metadata.relProjectPath)
                    }
                };
            } else {
                return object;
            }
        })
    };
}

module.exports = {
    urlPathFromFilePath,
    cssClassesFromUrlPath,
    cssClassesFromFilePath,
    flattenMarkdownData,
    normalizePaths
};
