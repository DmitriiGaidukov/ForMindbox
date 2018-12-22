using System.Web.Http;
using BusinessLayerLibrary.Dto;
using BusinessLayerLibrary.Dto.ClientNetwork.TurnoverPlan;
using BusinessLayerLibrary.Services.ClientNetwork;
using Core.Internal.Kendo.DynamicLinq;

namespace CN.Controllers
{
    /// <summary>
    /// контроллер для данных для грида "Планы по дням" страницы "Планы по оборотам"
    /// </summary>
    public class TurnoverPlanController : ApiController
    {
        public TurnoverPlanEntityService TurnoverPlanService { get; set; }

        [HttpPost]
        public DataSourceResult<TurnoverPlanDto> Query(DataSourceRequestDto<TurnoverPlanFilterDto> request)
        {
            return TurnoverPlanService.GetQueryResultDto(request);
        }

        [HttpPost]
        public void Delete(TurnoverPlanDto dto)
        {
            TurnoverPlanService.Delete(dto.Id);
        }

        [HttpPost]
        public void Save(TurnoverPlanDto dto)
        {
            TurnoverPlanService.SaveDto(dto);
        }

        /// <summary>
        /// Возвращает элемент данных по указанному Id
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        [HttpPost]
        public TurnoverPlanDto GetById(TurnoverPlanDto dto)
        {
            return TurnoverPlanService.LoadDtoOrNull(dto.Id);
        }

 		[HttpPost]
        public void SaveFewDays(TurnoverPlanFewDaysDto dto)
        {
            TurnoverPlanService.SaveListDto(dto);

        }

        [HttpPost]
        public bool CheckPlan(DateTimePeriodDto dto)
        {
            return TurnoverPlanService.CheckPlan(dto);
        }
    }
}