document.addEventListener('DOMContentLoaded', function () {
    const discordId = '1063195780212601012';
    const splash = document.getElementById('splash');
    const mainContent = document.getElementById('main-content');
    const bgVideo = document.getElementById('bg-video');
    const soundIcon = document.getElementById('sound-icon');
    const volumeSlider = document.getElementById('volume-slider');

    bgVideo.muted = false;
    bgVideo.volume = 1;

    volumeSlider.addEventListener('input', function () {
        bgVideo.volume = this.value;
        soundIcon.className = this.value == 0 ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    });

    splash.addEventListener('click', function () {
        bgVideo.play()
            .then(() => {
                splash.style.display = 'none';
                mainContent.style.display = 'block';
            })
            .catch(error => {
                bgVideo.muted = true;
                bgVideo.play()
                    .then(() => {
                        splash.style.display = 'none';
                        mainContent.style.display = 'block';
                    });
            });
    });

    fetch(`https://api.lanyard.rest/v1/users/${discordId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const discordData = data.data;
                const avatar = document.getElementById('discord-avatar');
                const status = document.getElementById('discord-status');

                if (discordData.discord_user.avatar) {
                    avatar.style.backgroundImage = `url(https://cdn.discordapp.com/avatars/${discordId}/${discordData.discord_user.avatar}.png?size=256)`;
                }
                status.classList.add(discordData.discord_status);

                const widgetAvatar = document.getElementById('widget-avatar');
                const widgetStatus = document.getElementById('widget-status');
                const username = document.getElementById('discord-username');
                const activity = document.getElementById('discord-activity');

                widgetAvatar.src = `https://cdn.discordapp.com/avatars/${discordId}/${discordData.discord_user.avatar}.png?size=128`;
                widgetStatus.classList.add(discordData.discord_status);

                username.textContent = `${discordData.discord_user.username}#${discordData.discord_user.discriminator}`;

                if (discordData.activities?.length > 0) {
                    const gameActivity = discordData.activities.find(a => a.type === 0);
                    activity.textContent = gameActivity
                        ? `Playing ${gameActivity.name}${gameActivity.details ? `: ${gameActivity.details}` : ''}`
                        : `Status: ${discordData.discord_status}`;
                } else {
                    activity.textContent = `Status: ${discordData.discord_status}`;
                }
            }
        })
        .catch(error => console.error('Error fetching Discord data:', error));
});