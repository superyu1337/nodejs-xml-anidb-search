const xml2js = require('xml2js');
const fs = require('fs');
const Fuse = require('fuse.js');
const prompt = require('prompt-sync')({sigint: true});
const clipboardy = require('clipboardy');

const xml = fs.readFileSync('./anime-titles.xml');

function generateJson(animelist) {
    let new_anime_list = [];

    animelist.forEach(anime => {
        anime.title.forEach(title => {
            new_anime_list.push(`${title._} [anidb=${anime['$'].aid}]`);
        });
    })

    return new_anime_list;
}

async function main() {
    let jsontemp = await xml2js.parseStringPromise(xml);
    const animelist = generateJson(jsontemp.animetitles.anime);
    //console.log(animelist);

    while (true) {
        const input = prompt("Anime name: ");
        const fuse = new Fuse(animelist);
        const output = fuse.search(input);

        let confirmation = false;

        output.forEach(match => {
            if (confirmation)
                return;
            else {
                const confirm_input = prompt(`Highest Match: ${match.item}, is this right? `);

                if (confirm_input.toLowerCase() == "") {
                    confirmation = true;
                    clipboardy.writeSync(match.item);
                }
            }
        })
    }
}

main();