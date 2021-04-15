import { makeDiv } from "../../../core/utils";
import { enumHubGoalRewards } from "../../tutorial_goals";
import { BaseHUDPart } from "../base_hud_part";
import { DynamicDomAttach } from "../dynamic_dom_attach";
import { enumNotificationType } from "./notifications";

export class HUDSandboxController extends BaseHUDPart {
    createElements(parent) {
        this.element = makeDiv(
            parent,
            "ingame_HUD_SandboxController",
            [],
            `
            <label>Sandbox Options</label>
            <span class="sandboxHint">Use F6 to toggle this overlay</span><br>
            <span class="sandboxHint">Only use this if you don't want to play through properly</span>

            <div class="buttons">
                <div class="levelToggle plusMinus">
                    <label>Level</label>
                    <button class="styledButton minus">-</button>
                    <button class="styledButton plus">+</button>
                </div>
                
                

            </div>
        `
        );

        const bind = (selector, handler) => this.trackClicks(this.element.querySelector(selector), handler);

        bind(".levelToggle .minus", () => this.modifyLevel(-1));
        bind(".levelToggle .plus", () => this.modifyLevel(1));
    }

    modifyUpgrade(id, amount) {
        const upgradeTiers = this.root.gameMode.getUpgrades()[id];
        const maxResearchLevel = this.root.hubGoals.researchLevel;

        const currentLevel = this.root.hubGoals.upgradeLevels[id]
        const isAtMax =  currentLevel >= maxResearchLevel;
        this.root.hubGoals.upgradeLevels[id] = Math.max(
            0,
            Math.min(currentLevel > 4 ? currentLevel : 4, maxResearchLevel, (this.root.hubGoals.upgradeLevels[id] || 0) + amount),
        );

        // Compute improvement
        let improvement = 1;
        for (let i = 0; i < this.root.hubGoals.upgradeLevels[id]; ++i) {
            improvement += upgradeTiers[i].improvement;
        }
        this.root.hubGoals.upgradeImprovements[id] = improvement;
        this.root.signals.upgradePurchased.dispatch(id);
        if(isAtMax) {
            this.root.hud.signals.notification.dispatch(
                "Upgrade '" + id + "' is already at the max tier unlocked",
                enumNotificationType.upgrade
            );
        } else {
            this.root.hud.signals.notification.dispatch(
                "Upgrade '" + id + "' is now at tier " + (this.root.hubGoals.upgradeLevels[id] + 1),
                enumNotificationType.upgrade
            );
        }
        
    }

    modifyLevel(amount) {
        const hubGoals = this.root.hubGoals;
        if(hubGoals.level + amount > 20 && false) {
            this.root.hud.signals.notification.dispatch(
                "You can't cheat past level 20 :/",
                enumNotificationType.upgrade
            );
            return;
        }
        hubGoals.level = Math.max(1, hubGoals.level + amount);
        hubGoals.computeNextGoal();

        // Clear all shapes of this level
        hubGoals.storedShapes[hubGoals.currentGoal.definition.getHash()] = 0;

        this.root.hud.parts.pinnedShapes.rerenderFull();

        // Compute gained rewards
        hubGoals.gainedRewards = {};
        hubGoals.researchLevel = 1;
        const levels = this.root.gameMode.getLevelDefinitions();
        for (let i = 0; i < hubGoals.level - 1; ++i) {
            if (i < levels.length) {
                const reward = levels[i].reward;
                if(reward == enumHubGoalRewards.reward_research_level) {
                    hubGoals.researchLevel++;
                }
                hubGoals.gainedRewards[reward] = (hubGoals.gainedRewards[reward] || 0) + 1;
            }
        }

        this.root.hud.signals.notification.dispatch(
            "Changed level to " + hubGoals.level,
            enumNotificationType.upgrade
        );
    }

    initialize() {
        // Allow toggling the controller overlay
        this.root.gameState.inputReciever.keydown.add(key => {
            if (key.keyCode === 117) {
                // F6
                this.toggle();
            }
        });

        this.visible = false;
        this.domAttach = new DynamicDomAttach(this.root, this.element);
    }

    toggle() {
        this.visible = !this.visible;
    }

    update() {
        this.domAttach.update(this.visible);
    }
}
/*
                <div class="upgradesBelt plusMinus">
                    <label>Upgrades &rarr; Belt</label>
                    <button class="styledButton minus">-</button>
                    <button class="styledButton plus">+</button>
                </div>
                
                <div class="upgradesExtraction plusMinus">
                    <label>Upgrades &rarr; Extraction</label>
                    <button class="styledButton minus">-</button>
                    <button class="styledButton plus">+</button>
                </div>
                
                <div class="upgradesProcessing plusMinus">
                    <label>Upgrades &rarr; Processing</label>
                    <button class="styledButton minus">-</button>
                    <button class="styledButton plus">+</button>
                </div>
                
                <div class="upgradesPainting plusMinus">
                    <label>Upgrades &rarr; Painting</label>
                    <button class="styledButton minus">-</button>
                    <button class="styledButton plus">+</button>
                </div>
*/