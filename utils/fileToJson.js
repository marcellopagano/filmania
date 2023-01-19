const fs = require('fs')

const subFiles = (pathArr, drive) => {
    let files = []
    pathArr.forEach(pathName => {
        const realPath = `${drive}:/film/${pathName}`
        files.push(...fs.readdirSync(realPath, { withFileTypes: true })
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name))
    })
    return files
}

function filesToJson(jsonFile) {
    const titleReg = /\s\(\d+\).+/gi
    const yearReg = /\(\d+\)/gi
    // const formatReg = /[^?.]\w+$/gi
    let json = []

    const arrD = fs.readdirSync('d:/film', { withFileTypes: true })
    const arrE = fs.readdirSync('e:/film', { withFileTypes: true });
    const arrMerge = [...arrD, ...arrE]

    const files = arrMerge
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name)

    const subD = arrD
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
    const subE = arrE
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

    const subFilesD = subFiles(subD, 'd')
    const subFildsE = subFiles(subE, 'e')

    files.push(...subFilesD, ...subFildsE)
    files.sort()
    // console.log(files)
    files.forEach((title, idx) => {
        try {
            const replace = title.match(titleReg)[0]
            const fileName = title.replace(replace, '')
            const poster = `./poster/${fileName}.jpg`
            let year = title.match(yearReg)[0]
            // let format = title.match(formatReg)[0]
            year = year.replace(/\(|\)/g, (v) => v ? '' : '')
            json.push({
                id: idx + 1,
                poster: poster,
                trailer: '',
                title: fileName,
                genre: '-',
                year: year,
                Duration: '- min.',
                score: 0,
            })
        } catch (error) {
            console.log(`Error > ${title} ${error.message}`)
        }
    })

    if (!fs.existsSync(`./${jsonFile}`)) {
        json = JSON.stringify(json)
        fs.writeFileSync(jsonFile, json)
    } else {
        console.log('file exists')
    }

}
filesToJson('film.json')
