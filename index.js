require('dotenv').config();

const cron = require('node-cron');
const data = require('./getData');
const setData = require('./setData');

let morningArray = [];
let afternoonArray = [];
let eveningArray = [];

const getInfoByAsins = async () => {
    let morningAsins = [],
        aftrenoonBansForComparisons = [],
        afternoonAsins = [],
        eveningAsins = [];

    cron.schedule("10 0 5 * * *", async () => {

        morningArray = await data();
        let morningBans = morningArray.filter(array => array[2] == "Бан")
        console.log(`Morning Bans: ${morningBans.length}`)
        morningBans.map((el) => {
            morningAsins.push(el[1])
        })
    })

    cron.schedule("0 0 9 * * *", async () => {
        let bannedToday = 0;

        let today = new Date();
        let day = String(today.getDate()).padStart(2,'0');
        let month = String(today.getMonth()+1).padStart(2,'0');
        let year = today.getFullYear();
        let hours = String(today.getHours()).padStart(2, '0');
        let minutes = String(today.getMinutes()).padStart(2, '0');

        today = day + '.' + month + '.' + year + ' ';

        let time = hours + ':' + minutes;

        afternoonArray = await data();
        let afternoonBans = afternoonArray.filter(array => array[2] == "Бан");
        afternoonBans.map((el) => {
            aftrenoonBansForComparisons.push(el[1]);
            afternoonAsins.push(el[1]);
        })

        afternoonBans.map((el,index) => {
            if(morningAsins.includes(el[1]) == false){
                bannedToday += 1;
            }
        })

        let unbannedAsins = 0;
        morningAsins.map((el) => {
            if(afternoonAsins.includes(el) == false){
                unbannedAsins += 1
            }
        })

        console.log(`Afternoon Bans: ${bannedToday}`);
        console.log(`Unbanned Asins: ${unbannedAsins}`);

        const string = [[today, time, bannedToday, unbannedAsins]];
        setData(string);
    })

    cron.schedule("0 0 14 * * *", async () => {
        
        let today = new Date();
        let day = String(today.getDate()).padStart(2,'0');
        let month = String(today.getMonth()+1).padStart(2,'0');
        let year = today.getFullYear();
        let hours = String(today.getHours()).padStart(2, '0');
        let minutes = String(today.getMinutes()).padStart(2, '0');

        today = day + '.' + month + '.' + year;
        let time = hours + ':' + minutes;
        
        let bannedToday = 0;

        eveningArray = await data();

        let eveningBans = eveningArray.filter(array => array[2] == "Бан");
        eveningBans.map((el) => {
            eveningAsins.push(el[1]);
        })

        eveningBans.map((el) => {
            if(aftrenoonBansForComparisons.includes(el[1]) == false){
                bannedToday += 1;
            }
        })
  
        console.log(`Evening Bans: ${bannedToday}`)
        let unbannedAsins = 0;
        afternoonAsins.map((el) => {
            if(eveningAsins.includes(el) == false){
                unbannedAsins += 1;
            }
        })

        console.log(`Unbanned Asins: ${unbannedAsins}`);
        const string = [[today, time, bannedToday, unbannedAsins]];
        setData(string);
    })
}

cron.schedule("0 0 5 * * *", () => {
    getInfoByAsins();
})
