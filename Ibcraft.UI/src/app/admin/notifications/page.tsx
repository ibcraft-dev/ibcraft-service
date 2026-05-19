import AdminContainer from "@/shared/components/adminDashboardComponents/adminContainer";
import AdminNavNotifications from "@/shared/components/adminDashboardComponents/adminNavNotifications";
import Notifications from "@/shared/components/adminDashboardComponents/Notifications";

export default function AdminNotificationsPage() {
    return (
        
        <>
            <AdminContainer>
                <AdminNavNotifications />
                <Notifications id={1} text="Появилсь новые завки на проходки" info="В количестве 2 штуки" path="/admin/user"/>
                <Notifications id={2} text="Новый пользователь заригистривался на сайте" info="20 минут назад" path="/admin/request#new"/>
            </AdminContainer>
        </>
    )
}