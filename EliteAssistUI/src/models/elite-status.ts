/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { StatusFuel } from "./status-fuel";
import { StatusGuiFocus } from "./status-gui-focus";

export class EliteStatus {
    docked: boolean;
    landed: boolean;
    landingGearDown: boolean;
    shieldsUp: boolean;
    supercruise: boolean;
    flightAssistOff: boolean;
    hardpointsDeployed: boolean;
    inWing: boolean;
    lightsOn: boolean;
    cargoScoopDeployed: boolean;
    silentRunning: boolean;
    scoopingFuel: boolean;
    srvHandbrake: boolean;
    srvTurret: boolean;
    srvUnderShip: boolean;
    srvDriveAssist: boolean;
    fsdMassLocked: boolean;
    fsdCharging: boolean;
    fsdCooldown: boolean;
    lowFuel: boolean;
    overheating: boolean;
    hasLatLong: boolean;
    isInDanger: boolean;
    beingInterdicted: boolean;
    inMainShip: boolean;
    inFighter: boolean;
    inSRV: boolean;
    hudInAnalysisMode: boolean;
    nightVision: boolean;
    altitudeFromAverageRadius: boolean;
    fsdJump: boolean;
    srvHighBeam: boolean;
    fuel: StatusFuel;
    fuelCapacity: number;
    cargo: number;
    legalState: string;
    jumpRange: number;
    firegroup: number;
    latitude: number;
    longitude: number;
    altitude: number;
    heading: number;
    bodyName: string;
    planetRadius: number;
    guiFocus: StatusGuiFocus;
    pips: number[] = [0,0,0];
    onFoot: boolean;
    inTaxi: boolean;
    inMulticrew: boolean;
    onFootInStation: boolean;
    onFootOnPlanet: boolean;
    aimDownSight: boolean;
    lowOxygen: boolean;
    lowHealth: boolean;
    cold: boolean;
    hot: boolean;
    veryCold: boolean;
    veryHot: boolean;
    glideMode: boolean;
    onFootInHangar: boolean;
    onFootSocialSpace: boolean;
    onFootExterior: boolean;
    breathableAtmosphere: boolean;
}
