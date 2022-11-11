import { singleton } from "tsyringe";
import { EliteStatus } from "../models/generated/elite-status";
import { method, Service } from "./service";

@singleton()
export class StatusService extends Service {
  private eliteStatus: EliteStatus;

  constructor() {
    super("status-service", "status")
  }

  protected connectionOpened(): void {
    super.connectionOpened();
    this.send("get")
  }

  @method("update")
  public updateStatus(eliteStatus: EliteStatus): void {
    console.log(`update status`);
    this.eliteStatus = eliteStatus;
  }

  @method("reset")
  public resetStatus(): void {
    console.log(`reset status`);
  }
}
