document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bgMusic');
    try {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
    } catch (e) {
        console.log("Audio error:", e);
    }

    function updateViewCounter() {
        let count = localStorage.getItem('pageViewCount');
        count = count ? parseInt(count) + 1 : 1;
        localStorage.setItem('pageViewCount', count);
        const counterElement = document.getElementById('view-counter');
        if (counterElement) {
            counterElement.textContent = count.toLocaleString();
        }
    }
    updateViewCounter();

    const DISCORD_ID = '1063195780212601012';
    const widget = document.getElementById('discord-widget');

    const BADGES = {
        Staff: { flag: 1 << 0, title: 'Discord Employee', icon: 'https://raw.githubusercontent.com/MrCracker-OP/Lanyard-Badges/main/assets/staff.svg' },
        Partner: { flag: 1 << 1, title: 'Partnered Server Owner', icon: 'https://raw.githubusercontent.com/MrCracker-OP/Lanyard-Badges/main/assets/partner.svg' },
        Hypesquad: { flag: 1 << 2, title: 'HypeSquad Events', icon: 'https://raw.githubusercontent.com/MrCracker-OP/Lanyard-Badges/main/assets/hypesquad.svg' },
        BugHunterLevel1: { flag: 1 << 3, title: 'Bug Hunter Level 1', icon: 'https://raw.githubusercontent.com/MrCracker-OP/Lanyard-Badges/main/assets/bug_hunter_level_1.svg' },
        HypeSquadOnlineHouse1: { flag: 1 << 6, title: 'HypeSquad Bravery', icon: 'https://raw.githubusercontent.com/MrCracker-OP/Lanyard-Badges/main/assets/hypesquad_bravery.svg' },
        HypeSquadOnlineHouse2: { flag: 1 << 7, title: 'HypeSquad Brilliance', icon: 'https://raw.githubusercontent.com/MrCracker-OP/Lanyard-Badges/main/assets/hypesquad_brilliance.svg' },
        HypeSquadOnlineHouse3: { flag: 1 << 8, title: 'HypeSquad Balance', icon: 'https://raw.githubusercontent.com/MrCracker-OP/Lanyard-Badges/main/assets/hypesquad_balance.svg' },
        PremiumEarlySupporter: { flag: 1 << 9, title: 'Early Supporter', icon: 'https://raw.githubusercontent.com/MrCracker-OP/Lanyard-Badges/main/assets/early_supporter.svg' },
        BugHunterLevel2: { flag: 1 << 14, title: 'Bug Hunter Level 2', icon: 'https://raw.githubusercontent.com/MrCracker-OP/Lanyard-Badges/main/assets/bug_hunter_level_2.svg' },
        VerifiedDeveloper: { flag: 1 << 17, title: 'Early Verified Bot Developer', icon: 'https://raw.githubusercontent.com/MrCracker-OP/Lanyard-Badges/main/assets/verified_developer.svg' },
        CertifiedModerator: { flag: 1 << 18, title: 'Discord Certified Moderator', icon: 'https://raw.githubusercontent.com/MrCracker-OP/Lanyard-Badges/main/assets/moderator_programs.svg' },
        ActiveDeveloper: { flag: 1 << 22, title: 'Active Developer', icon: 'https://raw.githubusercontent.com/MrCracker-OP/Lanyard-Badges/main/assets/active_developer.svg' }
    };

    function getCreationDate(id) {
        const timestamp = (BigInt(id) >> 22n) + 1420070400000n;
        return new Date(Number(timestamp)).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    }

    async function fetchDiscordProfile() {
        if (!widget) return;
        try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
            const { data } = await response.json();

            if (!data) {
                widget.innerHTML = `<div class="discord-loading"><span>User not found or offline.</span></div>`;
                return;
            }

            const { discord_user, discord_status, activities } = data;

            let bannerHtml = '';
            if (discord_user.banner) {
                const bannerUrl = `https://cdn.discordapp.com/banners/${discord_user.id}/${discord_user.banner}.${discord_user.banner.startsWith('a_') ? 'gif' : 'png'}?size=4096`;
                bannerHtml = `<img src="${bannerUrl}" alt="Discord Banner">`;
            } else if (discord_user.accent_color) {
                bannerHtml = `<div style="background-color: ${discord_user.accent_color}; width: 100%; height: 100%;"></div>`;
            }

            let badgesHtml = '';
            for (const badge of Object.values(BADGES)) {
                if ((discord_user.public_flags & badge.flag) === badge.flag) {
                    badgesHtml += `<img src="${badge.icon}" alt="${badge.title}" title="${badge.title}" class="badge-icon">`;
                }
            }

            const decorationUrl = 'https://cdn.jsdelivr.net/gh/itspi3141/discord-fake-avatar-decorations@main/public/decorations/chillet.png';
            const avatarDecorationHtml = `<img src="${decorationUrl}" alt="Avatar Decoration" class="discord-avatar-decoration">`;

            const playingActivity = activities.find(activity => activity.type === 0);
            const customStatus = activities.find(activity => activity.type === 4);
            let activityHtml = '';
            if (playingActivity) {
                const largeAssetUrl = playingActivity.assets?.large_image ? `https://cdn.discordapp.com/app-assets/${playingActivity.application_id}/${playingActivity.assets.large_image}.png` : '';
                activityHtml = `
                    <div class="discord-activity-section">
                        <h4 class="discord-section-title">Playing a game</h4>
                        <div class="discord-activity-content">
                            ${largeAssetUrl ? `<img src="${largeAssetUrl}" alt="${playingActivity.name}" class="discord-activity-icon">` : ''}
                            <div class="discord-activity-details">
                                <strong class="activity-name">${playingActivity.name}</strong>
                                <span class="activity-detail">${playingActivity.details || ''}</span>
                                <span class="activity-state">${playingActivity.state || ''}</span>
                            </div>
                        </div>
                    </div>`;
            } else if (customStatus) {
                activityHtml = `
                    <div class="discord-activity-section">
                        <h4 class="discord-section-title">Status</h4>
                        <div class="discord-activity-details activity-custom-status">
                            <span>${customStatus.emoji ? customStatus.emoji.name + ' ' : ''}${customStatus.state || ''}</span>
                        </div>
                    </div>`;
            }

            const displayName = discord_user.display_name || discord_user.global_name;

            widget.innerHTML = `
                <div class="discord-banner">${bannerHtml}</div>
                <div class="discord-header">
                    <div class="discord-pfp-wrapper">
                        <img src="https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png?size=256" alt="Discord PFP" class="discord-pfp">
                        ${avatarDecorationHtml}
                        <span class="discord-status-badge ${discord_status}"></span>
                    </div>
                    <div class="discord-badges">${badgesHtml}</div>
                </div>
                <div class="discord-body">
                    <div class="discord-names">
                        <h2 class="discord-username">${displayName}</h2>
                        <span class="discord-global-name">@${discord_user.username}</span>
                    </div>
                    <hr class="discord-divider">
                    <h4 class="discord-section-title">Member Since</h4>
                    <p class="discord-member-since">${getCreationDate(discord_user.id)}</p>
                    ${activityHtml ? '<hr class="discord-divider">' : ''}
                    ${activityHtml || ''}
                </div>
            `;
        } catch (error) {
            console.error("Failed to fetch Discord profile:", error);
            widget.innerHTML = `<div class="discord-loading"><span>Failed to load profile.</span></div>`;
        }
    }
    fetchDiscordProfile();
    setInterval(fetchDiscordProfile, 30000);

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.querySelector(link.getAttribute('href'));
            if (targetSection) {
                const topOffset = targetSection.getBoundingClientRect().top + window.pageYOffset - 40;
                window.scrollTo({ top: topOffset, behavior: 'smooth' });
            }
        });
    });

    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));

    const copyButton = document.getElementById('copy-button');
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById('discord-id').innerText).then(() => {
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = `<i class="fas fa-check"></i> Copied!`;
            copyButton.style.backgroundColor = 'var(--success-color)';
            copyButton.style.borderColor = 'var(--success-color)';
            setTimeout(() => {
                copyButton.innerHTML = originalText;
                copyButton.style.backgroundColor = `rgba(var(--accent-color-rgb), 0.8)`;
                copyButton.style.borderColor = `rgba(var(--accent-color-rgb), 0.9)`;
            }, 2000);
        }).catch(err => console.error('Failed to copy ID:', err));
    });
});