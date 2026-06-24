import { UserService } from "@/services/user.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminUserRoleForm } from "@/components/admin/admin-user-role-form";

export default async function AdminUsersPage() {
  const users = await UserService.getAllUsers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline-md font-bold text-obsidian">إدارة المستخدمين</h2>
      </div>

      <div className="bg-white border border-stone rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-stone/20">
            <TableRow>
              <TableHead className="text-right py-4">المستخدم</TableHead>
              <TableHead className="text-right py-4">البريد الإلكتروني</TableHead>
              <TableHead className="text-right py-4">تاريخ التسجيل</TableHead>
              <TableHead className="text-right py-4">رقم الهاتف</TableHead>
              <TableHead className="text-left py-4">الصلاحية</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-secondary">
                  لا يوجد مستخدمين.
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => (
                <TableRow key={user.id} className="hover:bg-stone/10 border-stone/50">
                  <TableCell className="font-medium text-obsidian">{user.name || "بدون اسم"}</TableCell>
                  <TableCell className="font-technical-mono text-sm">{user.email}</TableCell>
                  <TableCell dir="ltr" className="text-right text-secondary text-sm">
                    {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                  </TableCell>
                  <TableCell className="font-technical-mono text-sm">{user.phone || "-"}</TableCell>
                  <TableCell className="text-left">
                    <AdminUserRoleForm userId={user.id} currentRole={user.role as string} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
