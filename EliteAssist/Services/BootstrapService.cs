using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace EliteAssist.Services
{
    internal class BootstrapService : BackgroundService
    {
        public BootstrapService(
            ISystemService systemService,
            IActionService acionService,
            IBackbackService backpackService,
            ICargoService cargoService,
            IDashboardService dashboardService,
            IHotKeyService hotKeyService,
            IJournalService journalService,
            IMarketService marketService,
            INavigationService navigationService,
            IShipLockerService shipLockerService,
            IStatusService statusService) : base() {}

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}
