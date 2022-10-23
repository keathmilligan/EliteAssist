import { singleton } from "tsyringe";
import { method, Service } from "./service";

export class DashboardDefinition {
  constructor(
    public name: string,
    public overlay: boolean=true,
    public clickThrough: boolean=false
  ) {}
}


@singleton()
export class DashboardService extends Service {
  public dashboardDefinitions: Map<string, DashboardDefinition>;

  constructor() {
    super("dashboard-service", "dashboard")
    this.dashboardDefinitions = new Map();
  }

  get dashboards(): Array<DashboardDefinition> {
    const dashboardDefs: Array<DashboardDefinition> = [];
    this.dashboardDefinitions.forEach((value: DashboardDefinition) => {
      dashboardDefs.push(value);
    });
    return dashboardDefs;
  }

  public getDashboard(name: string): DashboardDefinition {
    return this.dashboardDefinitions.get(name);
  }

  @method("create")
  public createDashboard(): void {
    console.log(`create dashboard`);
  }
}
