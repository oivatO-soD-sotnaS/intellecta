<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\EventsDao;
use App\Dao\NotificationsDao;
use App\Dto\NotificationDto;
use App\Dto\PaginationDto;
use App\Services\ValidatorService;
use App\Vo\NotificationsFiltersVo;
use App\Vo\PaginationVo;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

readonly class NotificationsController extends BaseController {
    public function __construct(
        private NotificationsDao $notificationsDao,
        private EventsDao $eventsDao,
        private ValidatorService $validatorService
    ) {}
    public function getUserNotifications(Request $request, Response $response) {
        return $this->handleErrors($request, function() use ($request, $response) {
            $user = $request->getAttribute("user");
            $queryParameters = $request->getQueryParams();

            $pagination = new PaginationVo($queryParameters);
            $notificationsFilters = new NotificationsFiltersVo($queryParameters);

            $notifications = $this->notificationsDao->getUserNotificationsPaginated(
                $user->getUserId(),
                $pagination,
                $notificationsFilters->getDaoFilters()
            );

            if (count($notifications) === 0) {
                throw new HttpNotFoundException($request, "No notifications found.");
            }

            $notificationsDtos = array_map(
                function($notification) {
                    $event = $this->eventsDao->getEventById($notification->getEventId());

                    return new NotificationDto($notification, $event);
                }
            , $notifications);

            $total_records = $this->notificationsDao->countUserNotifications(
                $user->getUserId(),
                $notificationsFilters->getDaoFilters()
            );

            $total_pages = (int) ceil($total_records / $pagination->getLimit());
            $page = intdiv($pagination->getOffset(), $pagination->getLimit()) + 1;

            $paginationDto = new PaginationDto(
                $page,
                $total_pages,
                $total_records,
                $notificationsDtos
            );

            $response->getBody()->write(json_encode($paginationDto));
            return $response;
        });
    }

    public function setNotificationAsSeen(Request $request, Response $response, string $notification_id) {
        return $this->handleErrors($request, function() use ($request, $response, $notification_id) {
            $user = $request->getAttribute("user");

            $notification = $this->notificationsDao->getNotificationById($notification_id);

            if ($notification === null || $notification->getUserId() !== $user->getUserId()) {
                throw new HttpNotFoundException($request, "Notification not found.");
            }

            $this->notificationsDao->setNotificationAsSeen($notification_id);

            $response->getBody()->write(json_encode(["message" => "Notification marked as seen."]));
            return $response;
        });
    }
}