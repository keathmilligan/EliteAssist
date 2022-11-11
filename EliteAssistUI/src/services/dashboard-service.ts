import { singleton } from "tsyringe";
import { method, Service } from "./service";
import { Dashboard } from "../models/generated/dashboard";


@singleton()
export class DashboardService extends Service {
  private dashboardDefinitions: Array<Dashboard> = [];

  constructor() {
    super("dashboard-service", "dashboard")
  }

  protected connectionOpened(): void {
    super.connectionOpened();
    this.send('list');
  }

  get dashboards(): Array<Dashboard> {
    return this.dashboardDefinitions;
  }

  public getDashboard(idOrName: string | number): Dashboard {
    return this.dashboardDefinitions.find((dashboard) =>
      ((typeof idOrName === 'number' && dashboard.id == idOrName) ||
      (typeof idOrName === 'string' && dashboard.name == idOrName)));
  }

  public createDashboard(dashboard: Dashboard): void {
    console.log('create dashboard', dashboard);
    this.send('create', dashboard);
  }

  public updateDashboard(dashboard: Dashboard): void {
    console.log('update dashboard', dashboard);
    this.send('update', dashboard);
  }

  public deleteDashboard(id: number): void {
    console.log('delete dashboard', id);
    this.send('delete', id);
  }

  @method('list')
  public listDashboards(dashboards: Dashboard[]): void {
    console.log('updating dashboard list');
    this.dashboardDefinitions = dashboards;
  }

  @method("created")
  public dashboardCreated(dashboard: Dashboard): void {
    console.log('dashboard created', dashboard);
  }

  @method("updated")
  public dashboardUpdated(dashboard: Dashboard): void {
    console.log('dashboard updated', dashboard);
  }

  @method("deleted")
  public dashboardDeleted(dashboard: Dashboard): void {
    console.log('dashboard deleted', dashboard);
  }
}
