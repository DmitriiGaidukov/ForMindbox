using System.Linq;
using BusinessLayerLibrary.Domain.ClientNetwork;
using BusinessLayerLibrary.Dto;
using BusinessLayerLibrary.Dto.ClientNetwork.TurnoverPlan;
using BusinessLayerLibrary.Extensions.IEnumerableExtensions;
using BusinessLayerLibrary.Validation;
using Core.Services;
using FluentValidation;

namespace BusinessLayerLibrary.Services.ClientNetwork
{
    /// <summary>
    /// Сервис для работы с сущностью "Планы по оборотам"
    /// </summary>
    public class TurnoverPlanEntityService : AbstractEntityService<TurnoverPlanEntity, TurnoverPlanDto, TurnoverPlanFilterDto, TurnoverPlanDto>
    {
        public TurnoverPlanValidator Validator { get; set; }

        public CalendarEntityService CalendarEntityService { get; set; }

        /// <summary>
        /// Сохранение новой / Обновление существующей сущности
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public override TurnoverPlanEntity SaveDto(TurnoverPlanDto dto)
        {

            var entity = GetQuery().FirstOrDefault(plan => plan.Date == dto.Date)
                //если в бд нет записи за указанную дату, то создаем новый объект сущности 
                ?? new TurnoverPlanEntity();

            // мэппим из дто в сущность
            Mapper.Map(dto, entity);

            // проверяем на корректность
            Validator.ValidateAndThrow(entity);

            // сохраняем (вставляем/обновляем) запись
            if (entity.Id == 0)
                InsertWithIdentity(entity);
            else
                Update(entity);

            return entity;
        }


        /// <summary>
        /// формирование запроса с учетом фильтра
        /// </summary>
        /// <param name="query"></param>
        /// <param name="filterDto"></param>
        /// <returns></returns>
        protected override IQueryable<TurnoverPlanEntity> QueryCustomFilters(IQueryable<TurnoverPlanEntity> query, TurnoverPlanFilterDto filterDto)
        {
            // накладываем фильтр
            if (filterDto != null)
                query = query.Where(item => item.Date >= filterDto.StartMonthDate);

            return query;
        }

        /// <summary>
        /// Сохранение списка ДТО дней
        /// </summary>
        /// <param name="dto"></param>
        public void SaveListDto(TurnoverPlanFewDaysDto dto)
        {
            // получаем список дней по которым будем обновлять данные
            var inputDays = CalendarEntityService.GetWorkPeriod(dto.StartPeriod, dto.EndPeriod);
            // если нечего обновлять - заканчиваем
            if (inputDays.Count == 0) return;

            // если данные не надо менять, то удаляем даты, на которые уже есть план
            if (!dto.ChangeValue)
            {
                var usedDays = GetQuery().Where(x => inputDays.Contains(x.Date)).Select(item => item.Date);
                inputDays = inputDays.Where(x => !usedDays.Contains(x.Date)).ToList();
                // если нечего обновлять - заканчиваем
                if (inputDays.Count == 0) return;
            }

            // для каждого дня формируем ДТО и сохраняем.
            inputDays.Each(x =>
            {
                SaveDto(new TurnoverPlanDto { Date = x.Date, Income = dto.Value });
            });

        }

        /// <summary>
        /// Проверка наличия планов по списку, если нет возвращаем true
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public bool CheckPlan(DateTimePeriodDto dto)
        {
            // проверяем, что пересечения отсутствуют . условие совпадение по дате и план больше нуля.
            var res = GetQuery().ToList().Any(item => dto.StartPeriod <= item.Date && dto.EndPeriod >= item.Date);

            return !res;

        }
    }
}
