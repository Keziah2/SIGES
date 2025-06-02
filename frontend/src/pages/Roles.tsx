import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";

interface Role {
  id?: number;
  name: string;
  permissions: {
    [key: string]: boolean;
  };
}

const defaultPermissions = {
  can_manage_users: false,
  can_manage_schools: false,
  can_view_finance: false,
  can_access_dashboard: true,
};

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState<Role>({ name: "", permissions: { ...defaultPermissions } });
  const [open, setOpen] = useState(false);

  const fetchRoles = async () => {
    try {
      const res = await axios.get("/api/accounts/roles/");
      setRoles(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des rôles");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handlePermissionChange = (perm: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [perm]: !prev.permissions[perm],
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/accounts/roles/", newRole);
      toast.success("Rôle créé avec succès");
      fetchRoles();
      setOpen(false);
      setNewRole({ name: "", permissions: { ...defaultPermissions } });
    } catch (err) {
      toast.error("Erreur lors de la création du rôle");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Rôles</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Créer un Rôle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau rôle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du rôle</Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="Ex: Directeur pédagogique"
                />
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                {Object.entries(newRole.permissions).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handlePermissionChange(key)}
                    />
                    <span>{key.replace(/_/g, " ")}</span>
                  </label>
                ))}
              </div>
              <Button onClick={handleSubmit} className="w-full">
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <CardTitle>{role.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(role.permissions).map(([perm, enabled]) => (
                  enabled && (
                    <span
                      key={perm}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      {perm.replace(/_/g, " ")}
                    </span>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Roles;
