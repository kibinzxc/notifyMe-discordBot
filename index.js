const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // Required for prefix commands
    ]
});

const PREFIX = "!"; // Change this to your desired prefix

client.once('ready', () => {
    console.log(`${client.user.tag} is online! 🚀`);
});
client.on('messageCreate', (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'totalhours') {
        const startDate = new Date('2025-03-13');
        const today = new Date();
        const weeks = [];
        let currentWeek = [];
        let totalHours = 0;

        const startOfWeek = (date) => {
            const start = new Date(date);
            start.setDate(date.getDate() - date.getDay() + 1); // Start of the week (Monday)
            return start;
        };

        const endOfWeek = (date) => {
            const end = new Date(date);
            end.setDate(date.getDate() - date.getDay() + 5); // End of the week (Friday)
            return end;
        };

        let weekStart = startOfWeek(startDate);
        let weekEnd = endOfWeek(startDate);

        for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
            const dayOfWeek = date.getDay();
            if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Weekdays only (Monday to Friday)
                currentWeek.push(date.toDateString());
            }

            if (date > weekEnd || date.getTime() === today.getTime()) {
                if (currentWeek.length > 0) {
                    // Adjust the first week's start date to match the actual start date
                    const adjustedWeekStart = weeks.length === 0 ? startDate : weekStart;

                    const adjustedWeekEnd = weeks.length === 0 ? weekEnd : weekEnd; // Ensure the end date remains correct
                    weeks.push({
                        weekStart: adjustedWeekStart.toDateString(),
                        weekEnd: weekEnd.toDateString(),
                        hours: currentWeek.length * 8
                    });
                }
                weekStart = startOfWeek(date);
                weekEnd = endOfWeek(date);
                currentWeek = [];
            }
        }

        let replyMessage = `Hello **${message.member?.displayName || message.author.username}**! 👋\n\n📅 **Here's your weekly working hours analysis:**\n\n`;

        weeks.forEach((week, index) => {
            replyMessage += `➡️ **Week ${index + 1} (${week.weekStart} - ${week.weekEnd}):** ${week.hours} HOURS\n`;
            totalHours += week.hours;
        });


        const hoursLeft = 486 - totalHours;
        const daysLeft = Math.ceil(hoursLeft / 8);
        const weeksLeft = Math.floor(daysLeft / 5);


        replyMessage += `\n➡️ **Total Hours Worked (from March 13, 2025 to current day):** ${totalHours} HOURS`;
        replyMessage += `\n\n Your are **${hoursLeft} hours** or **${daysLeft} Days** or **${weeksLeft} weeks**  away from completing your internship! 🎉\n\n`;

        message.reply(replyMessage);
    }
});


client.login(process.env.TOKEN);
