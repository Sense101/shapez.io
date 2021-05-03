import { MetaBeltBuilding } from "../../buildings/belt";
import { MetaBeltCrossingBuilding } from "../../buildings/belt_crossing";
import { MetaCutterBuilding } from "../../buildings/cutter";
import { MetaDisplayBuilding } from "../../buildings/display";
import { MetaFilterBuilding } from "../../buildings/filter";
import { MetaLeverBuilding } from "../../buildings/lever";
import { MetaMinerBuilding } from "../../buildings/miner";
import { MetaMixerBuilding } from "../../buildings/mixer";
import { MetaPainterBuilding } from "../../buildings/painter";
import { MetaReaderBuilding } from "../../buildings/reader";
import { MetaRotaterBuilding } from "../../buildings/rotater";
import { MetaBalancerBuilding } from "../../buildings/balancer";
import { MetaStackerBuilding } from "../../buildings/stacker";
import { MetaShapeCombinerBuilding } from "../../buildings/shape_combiner";
import { MetaTrashBuilding } from "../../buildings/trash";
import { MetaHyperlinkBuilding } from "../../buildings/hyperlink";
import { MetaUndergroundBeltBuilding } from "../../buildings/underground_belt";
import { HUDBaseToolbar } from "./base_toolbar";
import { MetaStorageBuilding } from "../../buildings/storage";
import { MetaItemProducerBuilding } from "../../buildings/item_producer";
import { queryParamOptions } from "../../../core/query_parameters";

export class HUDBuildingsToolbar extends HUDBaseToolbar {
    constructor(root) {
        super(root, {
            primaryBuildings: [
                MetaBeltBuilding,
                MetaBalancerBuilding,
                MetaUndergroundBeltBuilding,
                MetaBeltCrossingBuilding,
                MetaMinerBuilding,
                MetaCutterBuilding,
                MetaRotaterBuilding,
                MetaStackerBuilding,
                MetaMixerBuilding,
                MetaPainterBuilding,
                MetaTrashBuilding,
                ...(queryParamOptions.sandboxMode || G_IS_DEV ? [MetaItemProducerBuilding] : []),
            ],
            secondaryBuildings: [
                MetaHyperlinkBuilding,
                MetaStorageBuilding,
                MetaReaderBuilding,
                MetaLeverBuilding,
                MetaFilterBuilding,
                MetaDisplayBuilding,
                MetaShapeCombinerBuilding,
            ],
            visibilityCondition: () =>
                !this.root.camera.getIsMapOverlayActive() && this.root.currentLayer === "regular",
            htmlElementId: "ingame_HUD_BuildingsToolbar",
        });
    }
}
