const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdir(dir, function(err, list) {
        if (err) return callback(err);
        let pending = list.length;
        if (!pending) return callback(null);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err) {
                        if (!--pending) callback(null);
                    });
                } else {
                    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                        refactorFile(file);
                    }
                    if (!--pending) callback(null);
                }
            });
        });
    });
}

function refactorFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    
    const regex = /import\s+\{\s*([^}]+)\s*\}\s+from\s+["']@fortawesome\/free-solid-svg-icons["'];?/g;
    
    let newContent = content.replace(regex, (match, p1) => {
        const icons = p1.split(',').map(i => i.trim()).filter(i => i);
        return icons.map(icon => `import { ${icon} } from "@fortawesome/free-solid-svg-icons/${icon}";`).join('\n');
    });

    if (newContent !== content) {
        fs.writeFileSync(filepath, newContent, 'utf8');
        console.log('Refactored:', filepath);
    }
}

walk(path.join(__dirname, 'src'), (err) => {
    if (err) console.error(err);
    else console.log('Done refactoring icons');
});
