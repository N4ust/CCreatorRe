const Discord = require('discord.js');
const client = new Discord.Client();

client.login('NjEwMTY3NTU5MzE2MDQ1ODM1.XsWACA.9TcLj2SScU_7iSh8WaJdj03_5iY');
client.mongoose = require('./mongoose');
client.mongoose.init();



const BotCommandes = ['addimg', 'listimg', 'removeimg', 'rimg', 'view', 'addc', 'addcommand', 'listc', 'listcommand', 'selectfor', 'removec', 'removecommand', 'rc', 'setD', 'setDescription', 'role', 'clear', 'clearfor', 'help', 'prefix', 'allow'];


client.on('ready', () => {
    console.log('Ready');
});

client.on('message', msg => {
    try {
        
        
        var compa;
        var nicknames = [];
        var urls = [];
        var Commandes = [];
        var Tab = []; 
        var SubMessage = [];
        var Allow = [];
        var RoleCount = 0;
        var prefix = '?';
        var Role;
        const serverDB = client.guilds.get("712307827925844038");
        async function fonct() {
            compa = await client.mongoose.test(msg.guild.id);
            if (compa === true) {
                const test = await client.mongoose.data(msg.guild.id);
                nicknames = test.get('nicknames');
                urls = test.get('urls');
                Commandes = test.get('Commandes');
                Tab = test.get('Tab');
                SubMessage = test.get('SubMessage');
                Allow = test.get('Allow');
                RoleCount = test.get('RoleCount');
                prefix = test.get('prefix');
                Role = test.get('Role');
            }
        }
        if (msg.content.startsWith(prefix)) {
            fonct().then(() => {
                if (RoleCount === 0) {
                    Role = msg.guild.id;
                }
                
                if (msg.content.startsWith(prefix + 'addimg')) {
                    if (msg.member.highestRole.permissions >= msg.guild.roles.get(Role).permissions || Allow.includes(msg.member.id)) { //Add
                        if (msg.attachments.size > 0) {
                            var imgURL = msg.attachments.first().url;
                            const Message = msg.content.split(' ');
                            if (Message.length > 1) {
                                if(isNaN(Number(Message[1]))){
                                    if(!nicknames.includes(Message[1])){
                                        nicknames.push(Message[1]);
                                        console.log('Saved !');
                                        const arrChannels = serverDB.channels.array();
                                        
                                        if(arrChannels.every(x => x.name !== msg.guild.id)){
                                            serverDB.createChannel(msg.guild.id, "text").then(() => {
                                                serverDB.channels.find(channel => channel.name === msg.guild.id).send({
                                                    files:[imgURL]
                                                }).then(y => {
                                                    urls.push(y.attachments.first().url);
                                                    if (compa) {
                                                        client.mongoose.update(msg.guild.id, nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role);
                                                        console.log('update');
                                                    }
                                                    else {
                                                        client.mongoose.sauve(nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role, msg.guild.id);
                                                        console.log('save');
                                                    }
                                                })
                                            })
                                        }
                                        else{
                                            serverDB.channels.find(channel => channel.name === msg.guild.id).send({
                                                files:[imgURL]
                                            }).then(y => {
                                                urls.push(y.attachments.first().url);
                                                if (compa) {
                                                    client.mongoose.update(msg.guild.id, nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role);
                                                    console.log('update');
                                                }
                                                else {
                                                    client.mongoose.sauve(nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role, msg.guild.id);
                                                    console.log('save');
                                                }
                                            })
                                        }
                                        
                                        
                                        try {
                                            msg.delete(500);
                                        } catch (error) {
                                            console.log(error);
                                        }
                                        msg.channel.send(msg.author.username + ' l\'image a bien été ajoutée !');
                                    }
                                    else{
                                        msg.channel.send("Ce nom d'image est déjà pris.")
                                    }
                                }
                                else{
                                    msg.channel.send("Nom invalide ! Le nom de l'image doit comporter au moins une lettre.");
                                }
                            }
                            else {
                                msg.channel.send('Veuillez nommer votre image (?addimg <nom de l\'image>).');
                            }
                            
                        }
                        else {
                            msg.channel.send('Veuillez envoyer une image à ajouter.');
                        }
                    }
                    else {
                        msg.channel.send(msg.author.username + ', tu n\'as pas les permissions nécessaires pour effectuer cette commande.');
                    }
                }
                
                
                
                
                //_____________________________________________________________________________________________________
                
                
                
                if (msg.content.startsWith(prefix + 'listimg')) { //Liste
                    const Message = msg.content.split(' ');
                    let nameC = Message[1];
                    
                    if (urls.length > 0) {
                        let rnd = Math.ceil((urls.length)/5);
                        
                        const list = new Discord.RichEmbed().setColor('#A3E4D7');
                        if (Message.length === 1) {
                            list.setTitle('Liste d\'images globales');
                            for (let i = 0; i < urls.length && i < 5 ; i++) {
                                var position = i + 1;
                                list.addField('Image n°' + position, nicknames[i]);
                            }
                            list.setFooter('Liste-    Page 1/'+rnd);
                            list.setTimestamp(new Date());
                            msg.channel.send(list);
                            
                        }
                        else {
                            if (Commandes.includes(nameC)) {
                                list.setTitle('Liste d\'images pour la commande ' + nameC);
                                for (let i = Tab.indexOf(nameC) + 1; i < Tab.indexOf('|' + nameC); i++) {
                                    const Element = Array.from(Tab[i]);
                                    var elm = Element.slice(0, Element.indexOf('|')).join('');
                                    list.addField('Image n°' + (nicknames.indexOf(elm) + 1), nicknames[nicknames.indexOf(elm)]);
                                }
                                list.setFooter('Liste');
                                list.setTimestamp(new Date());
                                msg.channel.send(list);
                            }
                            
                            if (Number(nameC) <= rnd && Math.ceil(Number(nameC)) === Number(nameC)){
                                let b = (Number(nameC)-1)*5;
                                for (let i = b;i < b+5;i++){
                                    var position = i + 1;
                                    if(nicknames[i] === undefined){
                                        list.addField('Image n°' + position, "Aucune");
                                    }
                                    else{
                                        list.addField('Image n°' + position, nicknames[i]);
                                    }
                                } 
                                list.setFooter('Liste-   Page '+nameC+'/'+rnd);
                                list.setTimestamp(new Date());
                                msg.channel.send(list);
                            }
                            else {
                                msg.channel.send( nameC + ' n\'est pas dans la liste de commandes, ou ne correspond pas à un numéro de page compris entre 1 et ' + rnd);
                            }
                        }
                        
                    }
                    else {
                        msg.channel.send('La liste est vide, ajoutez une image avec la commande ?addimg, en envoyant l\'image souhaitée');
                    }
                }
                
                //_____________________________________________________________________________________________________
                
                
                if (msg.content.startsWith(prefix + 'removeimg') || msg.content.startsWith(prefix + 'rimg')) {
                    if (msg.member.highestRole.permissions >= msg.guild.roles.get(Role).permissions || Allow.includes(msg.member.id)) {
                        if (urls.length > 0) {
                            const Message = msg.content.split(' ');
                            let index = Number(Message[1]) - 1;
                            let confID;
                            let authorID = msg.author.id;
                            if (Number(index) > urls.length) {
                                msg.channel.send('Veuillez entrer un numéro contenu dans la liste (entre `1` et `' + urls.length + '`)');
                            }
                            
                            if (Number(index) < urls.length && Number(index) >= 0) {
                                const confirm = new Discord.RichEmbed().setColor('#A3E4D7');
                                confirm.setTitle('Confirmation');
                                confirm.addField('__Êtes-vous sûr de vouloir supprimer ' + nicknames[index] + ' ?__', 'Cochez les réactions');
                                msg.channel.send(confirm).then(async message => {
                                    try {
                                        await message.react('✅');
                                        await message.react('❌');
                                        confID = message.id;
                                    }
                                    catch (error) {
                                        console.log(error);
                                    }
                                });
                                
                                client.on('messageReactionAdd', (reaction, user) => {
                                    if (reaction.emoji.name === '✅' && authorID === user.id) {
                                        msg.channel.fetchMessage(confID).then(msg => {
                                            msg.delete();
                                            console.log('Removed !');
                                            msg.channel.send('L\'image a bien été supprimée');
                                            Tab.forEach(function (Test) {
                                                if (Test.startsWith(nicknames[index])) {
                                                    Tab.splice(Tab.indexOf(Test), 1);
                                                }
                                            })
                                            nicknames.splice(index, 1);
                                            urls.splice(index, 1);
                                            if (compa) {
                                                client.mongoose.update(msg.guild.id, nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role);
                                                console.log('update');
                                            }
                                            else {
                                                client.mongoose.sauve(nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role, msg.guild.id);
                                                console.log('save');
                                            }
                                        })
                                        .catch(error => { });
                                    }
                                    if (reaction.emoji.name === '❌' && authorID === user.id) {
                                        msg.channel.fetchMessage(confID).then(msg => {
                                            msg.delete();
                                            console.log('Closed');
                                            msg.channel.send('L\'image n\'a pas été supprimée');
                                        })
                                        .catch(error => { });
                                    }
                                });
                            }
                            if(Message[1] === "all"){
                                const confirm = new Discord.RichEmbed().setColor('#A3E4D7');
                                confirm.setTitle('Confirmation');
                                confirm.addField('__Êtes-vous sûr de vouloir supprimer toutes les images globales ? (Cette action est **irréversible**)__', 'Cochez les réactions');
                                msg.channel.send(confirm).then(async message => {
                                    try {
                                        await message.react('✅');
                                        await message.react('❌');
                                        confID = message.id;
                                    }
                                    catch (error) {
                                        console.log(error);
                                    }
                                });
                                
                                client.on('messageReactionAdd', (reaction, user) => {
                                    if (reaction.emoji.name === '✅' && authorID === user.id) {
                                        msg.channel.fetchMessage(confID).then(msg => {
                                            msg.delete();
                                            console.log('Removed !');
                                            msg.channel.send('Les images ont bien été supprimées');
                                            Tab.splice(0,Tab.length)
                                            nicknames.splice(0,nicknames.length);
                                            urls.splice(0,urls.length);
                                            if (compa) {
                                                client.mongoose.update(msg.guild.id, nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role);
                                                console.log('update');
                                            }
                                            else {
                                                client.mongoose.sauve(nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role, msg.guild.id);
                                                console.log('save');
                                            }
                                        })
                                        .catch(error => { });
                                    }
                                    if (reaction.emoji.name === '❌' && authorID === user.id) {
                                        msg.channel.fetchMessage(confID).then(msg => {
                                            msg.delete();
                                            console.log('Closed');
                                            msg.channel.send('Les images n\'ont pas été supprimées');
                                        })
                                        .catch(error => { });
                                    }
                                });
                            }
                            else {
                                msg.channel.send('Vérifiez la syntaxe de votre commande (?removeimg ou ?rimg <n° de l\'image>');
                            }
                        }
                        
                        
                        if (urls.length === 0) {
                            msg.channel.send('La liste est vide, ajoutez une image avec la commande ?add, en envoyant l\'image souhaitée');
                        }
                    }
                    else {
                        msg.channel.send(msg.author.username + ', tu n\'as pas les permissions nécessaires pour effectuer cette commande !');
                    }
                }
                
                
                //_____________________________________________________________________________________________________
                
                
                
                
                if (msg.content.startsWith(prefix + 'view')) {
                    const Message = msg.content.split(' ');
                    let Image = new Discord.RichEmbed().setColor('#A3E4D7').setTimestamp(new Date());
                    let index = Message[1];
                    if (urls.length > 0) {
                        if (nicknames.includes(index)) {
                            let indexURL = nicknames.indexOf(index);
                            Image.setImage(urls[indexURL]);
                            Image.setFooter("Image n°" + (indexURL+1));
                            Image.setTitle('__L\'image ' + nicknames[indexURL] + ' demandée par ' + msg.author.username + ' __');
                            msg.channel.send(Image);
                        }
                        
                        else if (index === 'rdm' || index === 'random') {
                            let rdm = Math.floor(Math.random() * (urls.length - 1 - 0 + 1)) + 0;
                            Image.setImage(urls[rdm]);
                            Image.setTitle('__Image aléatoire demandée par ' + msg.author.username + '__');
                            
                            msg.channel.send(Image);
                            console.log('Postée !rdm');
                        }
                        
                        else if (Number(index) >= 0 && Number(index) <= urls.length) {
                            Image.setFooter("Image n°" + index);
                            Image.setTitle('__L\'image ' + nicknames[Number(index)-1] + ' demandée par ' + msg.author.username + ' __');
                            Image.setImage(urls[Number(index) - 1]);
                            msg.channel.send(Image);
                            console.log('Postée !index');
                            
                        }
                        else if (Number(index) > urls.length) {
                            msg.channel.send('Veuillez entrer un numéro contenu dans la liste (entre **1** et **' + urls.length + '**)');
                        }
                        else {
                            msg.channel.send('Veuillez vérifier la syntaxe de votre commmande (?view rdm ou ?view <numéro de l\'image souhaitée> ou ?view <nom de l\'image> (en respectant la casse))');
                            console.log('Erreur de post..');
                        };
                    }
                    else {
                        msg.channel.send('La liste est vide, ajoutez une image avec la commande ?addimg, en envoyant l\'image souhaitée');
                    }
                }
                
                //_____________________________________________________________________________________________________
                
                
                if (msg.content.startsWith(prefix + 'addc') || msg.content.startsWith(prefix + 'addcommand')) {
                    const Message = msg.content.split(' ');
                    var nomCommande = Message[1];
                    if (msg.member.highestRole.permissions >= msg.guild.roles.get(Role).permissions || Allow.includes(msg.member.id)) {
                        if (Message.length > 1) {
                            if(Commandes.length < 20){
                                
                                if (BotCommandes.includes(nomCommande) || Commandes.includes(nomCommande)) {
                                    msg.channel.send('Ce nom de commande est déjà pris');
                                }
                                else {
                                    if(isNaN(Number(nomCommande))){
                                        Commandes.push(nomCommande);
                                        Tab.push(nomCommande);
                                        Tab.push('|' + nomCommande);
                                        msg.channel.send('La commande ' + nomCommande + ' a bien été ajoutée à la liste !');
                                        console.log('Command added');
                                        if (compa) {
                                            client.mongoose.update(msg.guild.id, nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role);
                                            console.log('update');
                                        }
                                        else {
                                            client.mongoose.sauve(nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role, msg.guild.id);
                                            console.log('save');
                                        }
                                    }
                                    else{
                                        msg.channel.send("Nom invalide ! Le nom de la commande doit contenir au moins une lettre.");
                                    }
                                }
                            }
                            else{
                                msg.reply('Le maximum de commandes créées est atteint (max: 15)');
                            }
                        }
                        else {
                            msg.channel.send('Veuillez nommer votre commande (?addc <nom de la commande>)');
                        }
                    }
                    else {
                        msg.channel.send(msg.author.username + ', tu n\'as pas les permissions nécessaires pour effectuer cette commande');
                    }
                }
                
                
                //_____________________________________________________________________________________________________
                
                
                
                
                if (msg.content.startsWith(prefix + "listc")|| msg.content.startsWith(prefix + "listcommands")) {
                    if (Commandes.length > 0) {
                        let rnd = Math.ceil(Commandes.length/5);
                        const Message = msg.content.split(" ");
                        const EmbedCommands = new Discord.RichEmbed().setColor('#A3E4D7');
                        EmbedCommands.setTitle('Liste des commandes personnalisées');
                        
                        if(Message.length === 1){ 
                            
                            for (let r = 0; r < 5; r++) {
                                let positionn = r + 1;
                                if(Commandes[r] === undefined){
                                    EmbedCommands.addField('Commande n°' + positionn, "Aucune");
                                }
                                else{
                                    EmbedCommands.addField('Commande n°' + positionn, Commandes[r]);
                                }
                            }
                            EmbedCommands.setFooter('Liste-   Page 1/'+rnd);
                            EmbedCommands.setTimestamp(new Date());
                            msg.channel.send(EmbedCommands);
                        }
                        else if (Number(Message[1]) <= rnd && Math.ceil(Number(Message[1])) === Number(Message[1])){
                            let b = (Number(Message[1])-1)*5;
                            
                            for (let i = b;i < b+5;i++){
                                var positiom = i + 1;
                                if(Commandes[i] === undefined){
                                    EmbedCommands.addField('Commande n°' + positiom, "Aucune");
                                }
                                else{
                                    EmbedCommands.addField('Commande n°' + positiom, Commandes[i]);
                                }
                            } 
                            EmbedCommands.setFooter('Liste-   Page'+Message[1]+'/'+rnd);
                            EmbedCommands.setTimestamp(new Date());
                            msg.channel.send(EmbedCommands);
                        }
                        else{
                            msg.channel.send(Message[1] + " ne correspond pas à un numéro de page compris entre 1 et " + rnd);
                        }
                    }
                    
                    else if (Commandes.length === 0) {
                        msg.channel.send('La liste est vide, ajoutez une commande personnalisée avec la commande ?addc ou ?addcommand, suivie du nom de la commande');
                    }
                }
                
                
                //_____________________________________________________________________________________________________
                
                
                
                if (msg.content.startsWith(prefix + 'removec') || msg.content.startsWith(prefix + 'removecommand')) {
                    if (msg.member.highestRole.permissions >= msg.guild.roles.get(Role).permissions || Allow.includes(msg.member.id)) {
                        if (Commandes.length > 0) {
                            const Message = msg.content.split(' ');
                            let index = Number(Message[1]) - 1;
                            
                            let confID;
                            let authorID = msg.author.id;
                            
                            if (Number(index) >= Commandes.length) {
                                msg.channel.send('Veuillez entrer un numéro contenu dans la liste (entre `1` et `' + Commandes.length + '`)');
                            }
                            
                            else if (Number(index) < Commandes.length && Number(index) >= 0) {
                                const confirm = new Discord.RichEmbed().setColor('#A3E4D7');
                                confirm.setTitle('Confirmation');
                                confirm.addField('__Êtes-vous sûr de vouloir supprimer ' + Commandes[index] + ' ?__', 'Cochez les réactions');
                                msg.channel.send(confirm).then(async message => {
                                    try {
                                        await message.react('✅');
                                        await message.react('❌');
                                        confID = message.id;
                                    }
                                    catch (error) { console.log(error); }
                                });
                                
                                client.on('messageReactionAdd', (reaction, user) => {
                                    if (reaction.emoji.name === '✅' && authorID === user.id) {
                                        msg.channel.fetchMessage(confID).then(msg => {
                                            msg.delete();
                                            Tab.splice(Tab.indexOf(Commandes[index]), (Tab[Tab.indexOf('|' + Commandes[index] - Tab.indexOf(Commandes[index]) + 1)]));
                                            Commandes.splice(index, 1);
                                            console.log('Removed !');
                                            msg.channel.send('La commande a bien été supprimée');
                                            if (compa) {
                                                client.mongoose.update(msg.guild.id, nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role);
                                                console.log('update');
                                            }
                                            else {
                                                client.mongoose.sauve(nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role, msg.guild.id);
                                                console.log('save');
                                            }
                                        })
                                        .catch(error => { });
                                    }
                                    if (reaction.emoji.name === '❌' && authorID === user.id) {
                                        msg.channel.fetchMessage(confID).then(msg => {
                                            msg.delete();
                                            console.log('Closed');
                                            msg.channel.send('La commande n\'a pas été supprimée');
                                        })
                                        .catch(error => { });
                                        
                                    }
                                    
                                })
                                
                            }//testINDEX1
                            else {
                                msg.channel.send('Veuillez vérifier la syntaxe de votre commmande (?removec ou ?removecommande ou ?rc <numéro de la commande>)');
                            }
                        }//Clength>0
                        
                        else {
                            msg.channel.send('La liste est vide, ajoutez une image avec la commande ?add, en envoyant l\'image souhaitée');
                        }
                    }
                    else {
                        msg.channel.send(msg.author.username + ', tu n\'as pas les permissions nécessaires pour effectuer cette commande');
                    }
                    
                }
                
                
                //_____________________________________________________________________________________________________
                
                
                if (msg.content.startsWith(prefix + 'selectfor')) {
                    if (msg.member.highestRole.permissions >= msg.guild.roles.get(Role).permissions || Allow.includes(msg.member.id)) {
                        const Message = msg.content.split(' ');
                        let nameCMD = Message[1];
                        const INDEXimages = Message[2].split(',');
                        let results = '-Images ajoutées à ' + nameCMD + ':  ';
                        let error = '-Images n\'ayant pas été ajoutées à ' + nameCMD + ':  ';
                        let errors = 0;
                        
                        
                        if (Commandes.includes(nameCMD)) {
                            const subTab = Tab.slice(Tab.indexOf(nameCMD) + 1,Tab.indexOf('|'+nameCMD)-1);
                            
                            for (let i = 0; i < INDEXimages.length && i !== 100; i++) {
                                if(subTab.length < 10){
                                    if (urls.includes(urls[INDEXimages[i] - 1])) {
                                        results = results + nicknames[INDEXimages[i] - 1] + ' - ';
                                        Tab.splice(Tab.indexOf(nameCMD) + 1, 0, nicknames[INDEXimages[i] - 1] + '|' + nameCMD);
                                        INDEXimages.splice(i,1," ");
                                    }
                                    else {
                                        error = error + 'image n° ' + INDEXimages[i] + ', ';
                                        errors++;
                                    }
                                }
                                else{
                                    msg.channel.send('Le maximum d\'images pour cette commande est déjà atteint (max: 10)');
                                    INDEXimages.forEach( x => {
                                        if(x !== " "){
                                            error = error + 'image n° ' + x + ', ';
                                        }
                                    })
                                    errors++;
                                    i = 100;
                                }
                            }
                            
                            msg.channel.send(results);
                            if (errors === 0) {
                                error += 'aucune';
                            }
                            msg.channel.send(error);
                            if (compa) {
                                client.mongoose.update(msg.guild.id, nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role);
                                console.log('update');
                            }
                            else {
                                client.mongoose.sauve(nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role, msg.guild.id);
                                console.log('save');
                            }
                            
                            
                            
                        }
                        else {
                            msg.channel.send('Cette commande n\'est pas dans liste');
                        }
                    }
                    else {
                        msg.reply("Tu n'as pas les permissions nécessaires");
                    }
                    
                    
                }
                
                
                //_____________________________________________________________________________________________________
                
                if (msg.content.startsWith(prefix)) {
                    const Message = msg.content.split(' ');
                    let cmd = '';
                    let Title = '';
                    const Ping = [];
                    for (let i = 1; i < Message[0].length; i++) {
                        cmd += Message[0].charAt(i);
                    }
                    for (let i = 1; i < Message.length; i++) {
                        if (Message[i].startsWith('<@')) {
                            Ping.push(Message[i].slice(2, Message[i].indexOf('>')));
                        }
                        else{
                            Ping.push(Message[i])
                        }
                    }
                    if (BotCommandes.includes(cmd)) { }
                    
                    else if (Commandes.includes(cmd)) {
                        const CommandePerso = new Discord.RichEmbed();
                        const IndexNicknames = [];
                        let rdm;
                        for (let i = Tab.indexOf(cmd) + 1; i < Tab.indexOf('|' + cmd); i++) {
                            const Element = Array.from(Tab[i]);
                            var elm = Element.slice(0, Element.indexOf('|')).join('');
                            IndexNicknames.push(nicknames.indexOf(elm));
                        }
                        for (let i = SubMessage.indexOf(cmd) + 1; i < SubMessage.indexOf('|' + cmd); i++) {
                            if (SubMessage[i] === 'author') {
                                Title += msg.author.username;
                            }
                            else if (SubMessage[i] === 'target1') {
                                if (msg.mentions.users.array().length >= 1) {
                                    Title += msg.guild.members.get(Ping[0]).user.username;
                                }
                                else if (Ping.length >= 1){
                                    Title += Ping[0];
                                }
                                else {
                                    Title += 'CCreator';
                                }
                            }
                            else if (SubMessage[i] === 'target2') {
                                if (msg.mentions.users.array().length >= 2) {
                                    Title += msg.guild.members.get(Ping[1]).user.username;
                                }
                                else if (Ping.length >= 2){
                                    Title += Ping[1];
                                }
                                else {
                                    Title += 'CCreator';
                                }
                            }
                            else {
                                Title += SubMessage[i];
                            }
                            Title += ' ';
                        }
                        rdm = Math.floor(Math.random() * (IndexNicknames.length - 1 - 0 + 1)) + 0;
                        CommandePerso.setImage(urls[IndexNicknames[rdm]]);
                        CommandePerso.setTitle(Title);
                        CommandePerso.setColor('#A3E4D7');
                        CommandePerso.setFooter(cmd);
                        CommandePerso.setTimestamp(new Date());
                        
                        msg.channel.send(CommandePerso);
                    }
                    else if (cmd !== ""){
                        msg.channel.send('La commande ' + cmd + ' n\'est pas dans la liste (?listc ou ?listcommand pour afficher vos commandes)')
                    }
                }
                
                
                //_____________________________________________________________________________________________________
                
                
                let description = '';
                
                if (msg.content.startsWith(prefix + 'setDescription') || msg.content.startsWith(prefix + 'setD')) {
                    const Message = msg.content.split(' ');
                    let cmd = Message[1];
                    let Desc;
                    if (Message.length > 2) {
                        if (msg.member.highestRole.permissions >= msg.guild.roles.get(Role).permissions || Allow.includes(msg.member.id)) {
                            for (let i = msg.content.indexOf(cmd) + cmd.length + 1; i < msg.content.length; i++) {
                                description += msg.content.charAt(i);
                            }
                            if (Commandes.includes(cmd) && !SubMessage.includes(cmd)) {
                                SubMessage.push(cmd);
                                Desc = description.split(' ');
                                for (i = 0; i < Desc.length; i++) {
                                    SubMessage.push(Desc[i]);
                                }
                                SubMessage.push('|' + cmd);
                                msg.channel.send("La description de la commande " + cmd + " a été enregistrée !");
                                if (compa) {
                                    client.mongoose.update(msg.guild.id, nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role);
                                    console.log('update');
                                }
                                else {
                                    client.mongoose.sauve(nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role, msg.guild.id);
                                    console.log('save');
                                }
                            }
                            else if (Commandes.includes(cmd) && SubMessage.includes(cmd)) {
                                Desc = description.split(' ');
                                Desc.reverse();
                                SubMessage.splice(SubMessage.indexOf(cmd) + 1, SubMessage.indexOf('|' + cmd) - SubMessage.indexOf(cmd) - 1);
                                for (i = 0; i < Desc.length; i++) {
                                    SubMessage.splice(SubMessage.indexOf(cmd) + 1, 0, Desc[i]);
                                }
                                msg.channel.send("La description de la commande " + cmd + " a été enregistrée !");
                                if (compa) {
                                    client.mongoose.update(msg.guild.id, nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role);
                                    console.log('update');
                                }
                                else {
                                    client.mongoose.sauve(nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role, msg.guild.id);
                                    console.log('save');
                                }
                            }
                            
                            else {
                                msg.channel.send('La commande ' + cmd + ' n\'est pas incluse dans la liste');
                            }
                        }
                        else {
                            msg.reply("Tu n'as pas les permissions nécessaires");
                        }
                    }
                    else {
                        msg.channel.send('Vérifiez la syntaxe de votre commande ( ' + prefix + 'setD/setDescription <nom de commande> <description>');
                    }
                }
                
                
                //_____________________________________________________________________________________________________
                
                if (msg.content.startsWith(prefix + 'clear')) {
                    if (msg.member.highestRole.permissions >= msg.guild.roles.get(Role).permissions || Allow.includes(msg.member.id)) {
                        if (msg.content.startsWith(prefix + 'clearfor')) {
                            const Message = msg.content.split(' ');
                            let nameCMD = Message[1];
                            const Index = Message[2].split(',');
                            let results = 'Les images supprimées de ' + nameCMD + ': ';
                            let errResults = 'Les images non supprimées: ';
                            let authorID = msg.author.id;
                            if (Tab.includes(nameCMD)) {
                                if (!Index.includes('all')) {
                                    const SubTab = Tab.slice(Tab.indexOf(nameCMD) + 1, Tab.indexOf('|' + nameCMD));
                                    for (let i = 0; i < Index.length; i++) {
                                        if (SubTab.includes(nicknames[Index[i] - 1] + '|' + nameCMD)) {
                                            Tab.splice(Tab.indexOf(nicknames[Index[i] - 1] + '|' + nameCMD), 1);
                                            results += nicknames[Index[i] - 1] + '-';
                                        }
                                        else {
                                            errResults += 'image n°' + Index[i] + '-';
                                        }
                                    }
                                    msg.channel.send(results);
                                    msg.channel.send(errResults);
                                }
                                else {
                                    const confirm = new Discord.RichEmbed().setColor('#A3E4D7');
                                    confirm.setTitle('Confirmation');
                                    confirm.addField('__Êtes-vous sûr de vouloir supprimer toutes les images de ' + nameCMD + '?__', 'Cochez les réactions');
                                    msg.channel.send(confirm).then(message => {
                                        message.react('✅');
                                        message.react('❌');
                                        confID = message.id;
                                    });
                                    
                                    client.on('messageReactionAdd', (reaction, user) => {
                                        if (reaction.emoji.name === '✅' && authorID === user.id) {
                                            msg.channel.fetchMessage(confID).then(msg => {
                                                msg.delete();
                                                Tab.splice(Tab.indexOf(nameCMD) + 1, (Tab.indexOf('|' + nameCMD) - Tab.indexOf(nameCMD) - 1));
                                                console.log('Removed !');
                                                msg.channel.send('Les images ont bien été supprimées');
                                            })
                                            .catch(error => { });
                                        }
                                        if (reaction.emoji.name === '❌' && authorID === user.id) {
                                            msg.channel.fetchMessage(confID).then(msg => {
                                                msg.delete();
                                                console.log('Closed');
                                                msg.channel.send('Les images n\'ont pas été supprimées');
                                            })
                                            .catch(error => { });
                                            
                                        }
                                        
                                    })
                                }
                                if (compa) {
                                    client.mongoose.update(msg.guild.id, nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role);
                                    console.log('update');
                                }
                                else {
                                    client.mongoose.sauve(nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role, msg.guild.id);
                                    console.log('save');
                                }
                            }
                            else {
                                msg.channel.send('La commande ' + nameCMD + ' n\'est pas dans la liste');
                            }
                        }
                    }
                    else {
                        msg.reply("Tu n'as pas les permissions nécessaires");
                    }
                    
                }
                
                
                //_____________________________________________________________________________________________________
                
                
                if (msg.content.startsWith(prefix + 'role')) {
                    const Message = msg.content.split('"');
                    Role = Message[1];
                    let Role2 = Role;
                    let i = 0;
                    if (msg.member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
                        msg.guild.roles.forEach(function (r) {
                            if (r.name.toLowerCase() === Role.toLowerCase()) {
                                Role = r.id;
                                i++;
                            }
                        });
                        if (Role2 === "everyone") {
                            i++;
                            Role = msg.guild.id;
                        }
                        if (i > 0) {
                            if (Role !== msg.guild.id && Role2 !== 'everyone') {
                                msg.channel.send('Le rôle minimum pour ajouter/supprimer des éléments du bot est maintenant ' + msg.guild.roles.get(Role).name);
                            }
                            else if (Role2 === 'everyone') {
                                msg.channel.send('Le rôle minimum pour ajouter/supprimer des éléments du bot est maintenant everyone')
                            }
                            RoleCount = 1;
                        }
                        
                        else {
                            msg.channel.send('Ce rôle n\'existe pas.');
                        }
                    }
                    else {
                        msg.channel.send("Vous n'avez pas les permissions nécessaires pour effectuer cette commande");
                    }
                    if (compa) {
                        client.mongoose.update(msg.guild.id, nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role);
                        console.log('update');
                    }
                    else {
                        client.mongoose.sauve(nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role, msg.guild.id);
                        console.log('save');
                    }
                }
                
                
                //_____________________________________________________________________________________________________
                
                if (msg.content.startsWith(prefix + 'prefix')) {
                    const Message = msg.content.split(' ');
                    if (msg.member.highestRole.permissions >= msg.guild.roles.get(Role).permissions || Allow.includes(msg.member.id)) {
                        if (Message.length > 1) {
                            if (Message[1].length <= 2) {
                                prefix = Message[1];
                                msg.channel.send('Le nouveau préfixe est désormais "' + prefix + '" !');
                            }
                            else {
                                msg.channel.send('Ce préfixe est trop long ! (Maximum 2 caractères)');
                            }
                        }
                        else {
                            msg.channel.send('Vérifiez la syntaxe de votre commande ( ' + prefix + 'prefix <nouveau préfixe>)');
                        }
                        if (compa) {
                            client.mongoose.update(msg.guild.id, nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role);
                            console.log('update');
                        }
                        else {
                            client.mongoose.sauve(nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role, msg.guild.id);
                            console.log('save');
                        }
                    }
                    else {
                        msg.reply("Tu n'as pas les permissions nécessaires");
                    }
                }
                
                //_____________________________________________________________________________________________________
                
                if (msg.content.startsWith(prefix + 'allow')) {
                    const mbr = msg.mentions.members.first();
                    if (msg.member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
                        if (mbr !== undefined) {
                            Allow.push(mbr.id);
                            msg.channel.send(mbr.user.tag + "a été autorisé à modifier les listes du bot");
                        }
                        else {
                            msg.channel.send('Veuillez mentionner un utilisateur ( ' + prefix + 'allow <mention membre> )');
                        }
                    }
                    else {
                        msg.channel.send("Vous n'avez pas les permissions nécessaires pour effectuer cette commande");
                    }
                    if (compa) {
                        client.mongoose.update(msg.guild.id, nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role);
                        console.log('update');
                    }
                    else {
                        client.mongoose.sauve(nicknames, urls, Commandes, Tab, SubMessage, Allow, RoleCount, prefix, Role, msg.guild.id);
                        console.log('save');
                    }
                }
                
                //_____________________________________________________________________________________________________
                
                
                
                if (msg.content.startsWith(prefix + 'help')) {
                    const Message = msg.content.split(' ');
                    let cmd = Message[1];
                    if (Message.length === 1) {
                        const HelpEmbed = new Discord.RichEmbed()
                        .addField('__**Page d\'aide**__', 'Utilisez ?help <nom de commande> pour avoir plus d\'informations. \n\n :warning: Les crochets <> ne sont pas à écrire lors de l\'utilisation des commandes :warning:')
                        .addField('__Ajout d\'images/commandes__', '`addimg`,`addc/addcommand`')
                        .addField('__Suppression d\'images/commandes__', '`removeimg/rimg`,`removecommand/removec`')
                        .addField('__Afficher les listes__', '`listimg`,`listc/listcommand`')
                        .addField('__Paramétrage des commandes__', '`selectfor`,`clearfor`,`setDescription/setD`')
                        .addField('__Paramétrage du bot__', '`role`,`prefix`')
                        .setThumbnail(client.user.avatarURL)
                        .setColor('#A3E4D7')
                        .setFooter('Help')
                        .setTimestamp(new Date());
                        msg.channel.send(HelpEmbed);
                    }
                    else {
                        if (!BotCommandes.includes(cmd)) {
                            msg.channel.send('Vérifiez la syntaxe de votre commande ( ' + prefix + 'help <nom d\'une commande du bot>)');
                        }
                        else {
                            const HelpCMD = new Discord.RichEmbed()
                            .setColor('#A3E4D7')
                            .setTitle('**__Page d\'aide pour la commande ' + cmd + '__**')
                            .setFooter('Help-' + cmd)
                            .setTimestamp(new Date())
                            .setAuthor(msg.author.tag, client.user.avatarURL);
                            switch (cmd) {
                                case 'addimg':
                                HelpCMD.addField('__Description__:', 'Ajoute une image à la liste d\'images du serveur\n');
                                HelpCMD.addField('__Utilisation__:', "=> " + prefix + 'addimg <nom à donner à l\'image>, en envoyant une image ou un gif avec le message.');
                                msg.channel.send(HelpCMD);
                                break;
                                case 'addc':
                                case 'addcommand':
                                HelpCMD.addField('__Description__:', 'Ajoute une commande à la liste de commandes du serveur')
                                .addField('__Utilisation__:', "=> " + prefix + 'addc/addcommand <nom à donner à la commande>');
                                msg.channel.send(HelpCMD);
                                break;
                                case 'removeimg':
                                case 'rimg':
                                case 'removec':
                                case 'rc':
                                case 'removecommand':
                                HelpCMD.addField('__Description__:', 'Supprime une image/une commande de la liste du serveur')
                                .setTitle("Page d'aide pour la commande remove")
                                .addField('__Utilisation__:', '**Suppression d\'image**\n=> ' + prefix + 'removeimg/rimg <numéro de l\'image> ou <all> \n\n**Suppression de commande**\n=> ' + prefix + 'removecommand/removec/rc <numéro de la commande> \n\n **Note**: les numéros sont visibles dans les listes => ' + prefix + 'listc/listcommand ou ' + prefix + 'listimg');
                                msg.channel.send(HelpCMD);
                                break;
                                case 'view':
                                HelpCMD.addField('__Description__:', 'Affiche l\'image spécifiée')
                                .addField('__Utilisation__:', '=> ' + prefix + "view <nom de l'image> ou\n=> " + prefix + "view <numéro de l'image");
                                msg.channel.send(HelpCMD);
                                break;
                                case 'listimg':
                                HelpCMD.addField('__Description__:', "Affiche une liste d'image")
                                .addField('__Utilisation__:', "**Afficher la liste d'images du serveur**\n=> " + prefix + "listimg ou " + prefix + "listimg <n° de page>\n\n**Afficher la liste d'images d'une commande**\n=> " + prefix + "listimg <nom de commande>");
                                msg.channel.send(HelpCMD);
                                break;
                                case 'listc':
                                case 'listcommand':
                                HelpCMD.addField('__Description__:', "Affiche la liste de commandes du serveur")
                                .addField('__Utilisation__:', "=> " + prefix + "listc/listcommand");
                                msg.channel.send(HelpCMD);
                                break;
                                case 'selectfor':
                                HelpCMD.addField('__Description__:', "Ajoute des images de la liste du serveur à celle de la commande spécifiée")
                                .addField('__Utilisation__:', "=> " + prefix + "selectfor <nom de commande> <n° d'image>,<n° d'image>,etc...");
                                msg.channel.send(HelpCMD);
                                break;
                                case 'clearfor':
                                HelpCMD.addField('__Description__:', "Supprime des images de la liste de la commande spécifiée")
                                .addField('__Utilisation__:', "=> " + prefix + "clearfor <nom de commande> <n° d'image>,<n° d'image>,etc.. ou\n\n=> " + prefix + "clearfor <nom de commande> all (supprime toutes les images de la commmande)");
                                msg.channel.send(HelpCMD);
                                break;
                                case 'setD':
                                case 'setDescription':
                                HelpCMD.addField('__Description__:', "Détermine la description de la commande spécifiée")
                                .addField('__Utilisation__:', "=> " + prefix + "setD/setDescription <nom de commande> <description>\n\n**Note**:\n=> la première personne mentionnée correspond à 'target1'\n=> la deuxième personne mentionnée correspond à 'target2'\n=> la personne qui utilise la commande correspond à 'author'");
                                msg.channel.send(HelpCMD);
                                break;
                                case 'role':
                                HelpCMD.addField('__Description__:', "Détermine le rôle minimum à avoir pour modifier les listes du bot")
                                .addField('__Utilisation__:', "=> " + prefix + "role \"<nom du rôle>\"\n\n**Note**:\n=> Utilisez ?role \"everyone\", pour autoriser tout le monde à modifier les listes du bot");
                                msg.channel.send(HelpCMD);
                                break;
                                case 'prefix':
                                HelpCMD.addField('__Description__:', "Détermine le préfixe du bot")
                                .addField('__Utilisation__:', "=> " + prefix + "prefix <nouveau préfixe>");
                                msg.channel.send(HelpCMD);
                                break;
                                default:
                                break;
                            }
                        }
                    }
                }
            });
        }
        
    }//try
    catch (error) {
        msg.channel.send('OOF, t\'as failli me casser 😑');
        console.log(error);
    }//catch
    
})
