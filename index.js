const Discord = require('discord.js');
const Puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

const { prefix, token } = require('./config.json');
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
client.login(token);
client.once('ready', () => {
    console.log('ready');
    client.user.setActivity(`osu! | ${prefix}help`, {type: 'PLAYING'})
})

client.on('message', (message) => {
    
    if (message.author.bot){
        return false;
    }
    
    const arguments = message.content.slice(prefix.length).trim().split(' ');
    const cmd= arguments.shift().toLowerCase();
    if(cmd == 'help' || cmd == `rank` || cmd == 'map' || cmd == 'hentai'){
        
    
    if (message.content.startsWith(`${prefix}`)){
        if(cmd == 'help'){
            message.channel.send(`
            ?rank {user} : displays a user's rank based off of their favorite choice\n?map : displays the newest ranked beatmap and gives the beatmap link\n?hentai : random hentai generator
            `);
            return;
        }
        
        (async () => {
            message.channel.send("Loading...")
            Puppeteer.use(pluginStealth());
            const browser = await Puppeteer
                .launch({
                    headless: false
                })
            
            const page = await browser.newPage();
            if(cmd == 'hentai'){
                var max = 399900;
                var min = 1;
                var hentaiRan = Math.floor(Math.random()*(max-min) + min);
                console.log(hentaiRan);
                await page.goto(`https://nhentai.net/`);
                await page.waitForTimeout(400);

                await page.click('body > nav > form > input[type=search]');
                await page.type(`body > nav > form > input[type=search]`,   `${hentaiRan}`);
                await page.click(`body > nav > form > button`);

                
                let hentaiURL = page.url();
                let hentaiName = await page.$(`#info > h1 > span.pretty`);
                let hentaiNameValue = await page.evaluate(hn => hn.textContent, hentaiName);
                
                message.channel.send(`The random hentai generated is ${hentaiNameValue}, here is the link ;) ${hentaiURL}`);
                browser.close();
                
            }
            if(cmd == 'rank'){
                if(arguments.length == 0){
                    message.channel.send("please type a username");
                    browser.close();
                    return;
                    
                }
                await page.goto(`https://osu.ppy.sh/users/${arguments[0]}`);
                await page.waitForTimeout(400);

                if(page.url() == `https://osu.ppy.sh/users/${arguments[0]}`){
                    message.channel.send('That is not a valid Username');
                    browser.close();
                }

                else{
                
                    await page.waitForSelector(`body > div.osu-layout__section.osu-layout__section--full.js-content.user_show > div > div > div > div.osu-page.osu-page--generic-compact > div.js-switchable-mode-page--scrollspy.js-switchable-mode-page--page > div.profile-detail > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1) > div.value-display__value > div`)
                    await page.waitForSelector(`body > div.osu-layout__section.osu-layout__section--full.js-content.user_show > div > div > div > div.osu-page.osu-page--generic-compact > div.js-switchable-mode-page--scrollspy.js-switchable-mode-page--page > div.profile-info.profile-info--cover > div.profile-info__details > div.profile-info__info > h1 > span`);
                
                    let userElement = await page.$(`body > div.osu-layout__section.osu-layout__section--full.js-content.user_show > div > div > div > div.osu-page.osu-page--generic-compact > div.js-switchable-mode-page--scrollspy.js-switchable-mode-page--page > div.profile-info.profile-info--cover > div.profile-info__details > div.profile-info__info > h1 > span`);
                    let userValue = await page.evaluate(ue => ue.textContent, userElement);
                    let element = await page.$(`body > div.osu-layout__section.osu-layout__section--full.js-content.user_show > div > div > div > div.osu-page.osu-page--generic-compact > div.js-switchable-mode-page--scrollspy.js-switchable-mode-page--page > div.profile-detail > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1) > div.value-display__value > div`)
                let value = await page.evaluate(el => el.textContent, element);
                message.channel.send(`The Username ${userValue} has a rank of ${value}`);
                browser.close();
            }
        }
        if(cmd == 'map' && arguments.length == 0){
            await page.goto(`https://osu.ppy.sh/home`);
            await page.waitForTimeout(400);

            await page.click('body > div.osu-layout__section.osu-layout__section--full.js-content.home_index > nav > div.landing-nav.hidden-xs > div:nth-child(2) > a');
            await page.type('body > div.osu-layout__section.osu-layout__section--full.js-content.home_index > div.login-box.login-box--landing > div > form > div.login-box__row.login-box__row--inputs > input.login-box__form-input.js-login-form-input.js-nav2--autofocus', 'Uranium_');
            await page.type('body > div.osu-layout__section.osu-layout__section--full.js-content.home_index > div.login-box.login-box--landing > div > form > div.login-box__row.login-box__row--inputs > input:nth-child(2)', 'Sunburn10!');       
            await page.click('body > div.osu-layout__section.osu-layout__section--full.js-content.home_index > div.login-box.login-box--landing > div > form > div.login-box__row.login-box__row--actions > div > button');
            await page.waitForSelector(`body > div.osu-layout__section.osu-layout__section--full.js-content.home_index > div.osu-page > div > div.user-home__right-sidebar > div:nth-child(4) > a:nth-child(1) > div.user-home-beatmapset__meta > div.user-home-beatmapset__title-container > div.user-home-beatmapset__title.u-ellipsis-overflow`);
            
            let mapName = await page.$('body > div.osu-layout__section.osu-layout__section--full.js-content.home_index > div.osu-page > div > div.user-home__right-sidebar > div:nth-child(4) > a:nth-child(1) > div.user-home-beatmapset__meta > div.user-home-beatmapset__title-container > div.user-home-beatmapset__title.u-ellipsis-overflow');
            let mapNameValue = await page.evaluate(mp => mp.textContent, mapName);

            await page.click('body > div.osu-layout__section.osu-layout__section--full.js-content.home_index > div.osu-page > div > div.user-home__right-sidebar > div:nth-child(4) > a:nth-child(1) > div.user-home-beatmapset__chevron');
            let link = page.url();
            message.channel.send(`The newest ranked map is ${mapNameValue}, with a map link of: ${link}`);
            browser.close();
        }
        })();
        
    }
    }
    else {
        return;
    }
});
