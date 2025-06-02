import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: Role | null;
  school: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/accounts/users/");
      setUsers(res.data);
    } catch (error) {
      toast.error("Échec du chargement des utilisateurs");
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get("/api/accounts/roles/");
      setRoles(res.data);
    } catch (error) {
      toast.error("Échec du chargement des rôles");
    }
  };

  const handleOpen = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role?.id.toString() || "");
    setOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) return;
    try {
      await axios.patch(`/api/accounts/users/${selectedUser.id}/`, {
        role: selectedRole,
      });
      toast.success("Rôle mis à jour avec succès");
      fetchUsers();
      setOpen(false);
    } catch (error) {
      toast.error("Échec de la mise à jour du rôle");
    }
  };

  return (
    <div className="px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b font-medium">
                <tr>
                  <th className="px-4 py-2">Nom</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">École</th>
                  <th className="px-4 py-2">Rôle</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2">{user.first_name} {user.last_name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.school}</td>
                    <td className="px-4 py-2">{user.role?.name || "Aucun"}</td>
                    <td className="px-4 py-2">
                      <Button variant="outline" onClick={() => handleOpen(user)}>
                        Modifier rôle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>Modifier le rôle</DialogHeader>
          <div className="space-y-4">
            <Label>Utilisateur</Label>
            <Input value={`${selectedUser?.first_name} ${selectedUser?.last_name}`} disabled />
            <Label>Rôle</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateRole}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
