"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { useUpdateProfile, useUploadAvatar } from "@/lib/hooks";
import { Camera } from "lucide-react";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
  const { user, setUser } = useAuthStore();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAvatarPreview(user.avatar || null);
      setAvatarFile(null);
      setError(null);
    }
  }, [open, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const profile = await updateProfile.mutateAsync({ name, email, phone });

      let avatar = profile.avatar_url || "/avatar.jpg";
      if (avatarFile) {
        const uploaded = await uploadAvatar.mutateAsync(avatarFile);
        avatar = uploaded.avatar_url || avatar;
      }

      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone || "",
        joinDate: profile.join_date,
        avatar,
      });

      onOpenChange(false);
    } catch {
      setError("Gagal menyimpan profil. Coba lagi.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Tentukan informasi profil dan avatar Anda.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-6 mt-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="w-24 h-24 ring-4 ring-primary/10 transition-all group-hover:ring-primary/30 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt="Avatar Preview" className="object-cover" />
                ) : null}
                <AvatarFallback className="bg-primary-container text-white text-3xl font-semibold">
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">No. Handphone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+62"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateProfile.isPending || uploadAvatar.isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={updateProfile.isPending || uploadAvatar.isPending}>
              {updateProfile.isPending || uploadAvatar.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
