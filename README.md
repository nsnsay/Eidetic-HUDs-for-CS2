
# Welcome to `EideticHM`: Observer HUD for CS2


[中文](./README-CN.md)

[EideticHM](https://github.com/nsnsay/Eidetic-HUDs-for-CS2) is an open-source observer HUD designed specifically for broadcasters and tournament organizers, built upon the foundation of the [CS2 HUD project](https://github.com/drweissbrot/cs-hud).

---

## How to Use

1. Download the latest version of the program from [Releases](https://github.com/nsnsay/Eidetic-HUDs-for-CS2/releases/).
2. Extract the downloaded zip file.
3. Place the `gamestate_integration_eidetic_hud.cfg` file into the CS2 configuration folder (`game/csgo/cfg/`).
4. **Important**: Follow this exact sequence:
   - Launch `cs-hud.exe` first.
   - Then run `cs-hud-window.exe`.

---

## Functional Notes

### Team Logos

- When you first open `cs-hud.exe`, the program will automatically create a folder at `%appdata%/EideticHM`.
- Place team logo images in the `team-logos` subfolder within this directory.
- **Naming Convention**: The filename must exactly match the team name displayed in the HUD, formatted as `[Team Name].png`.
- Logos will be automatically displayed in the HUD.

### Performance Issues

If you encounter performance issues, consider the following optimizations:

- When capturing in OBS, use **Window Capture** for `cs-hud-window.exe` instead of a browser source.

---

For further assistance, feel free to reach out via:

- **Discord Community**: [Join Us](https://discord.gg/u38Cmu5Zf7)
- **Email**: troupqgog512956@gmail.com

We hope `EideticHM` enhances your broadcasting and tournament organization experience!
