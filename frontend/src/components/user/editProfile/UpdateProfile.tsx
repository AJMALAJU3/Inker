import { FC, useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import KeyValueInput from './KeyValueInput'
import { Card } from '@/components/ui/card'
import { ProfileService } from '@/services/profileService'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import useAuthStore from '@/store/authStore'
import { updateProfileSchema } from '@/schemas/userSchema'

interface SocialLink {
  platform: string;
  url: string;
}

const UpdateProfile: FC = () => {
  const { user } = useAuthStore()
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: '', url: '' },
  ]);

  useEffect(() => {
    if (user?.name) setFullName(user?.name)
    if (user?.bio) setBio(user.bio)
    if (user?.socialLinks) setSocialLinks(user?.socialLinks)
  }, [user])

  const handleSocialLinkChange = (index: number, platform: string, url: string) => {
    const updated = [...socialLinks];
    updated[index] = { platform, url };
    setSocialLinks(updated);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  };

  const handleSubmit = async () => {
    const payload = {
      name: fullName,
      bio,
      socialLinks: socialLinks.filter(link => link.platform && link.url),
    };

    const result = updateProfileSchema.safeParse(payload);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      Object.values(errors).forEach((errorArray) => {
        if (errorArray) {
          errorArray.forEach(err => toast.error(err));
        }
      });
      return;
    }

    const { message } = await ProfileService.updateProfileService(payload);
    if (message) toast.success(message);


  };

  return (
    <Card className="grid w-full items-center gap-1.5 space-y-2 p-4 shadow-none">
      <Label htmlFor="fullName">Full Name</Label>
      <Input
        id="fullName"
        placeholder="My name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <Label htmlFor="bio">Bio</Label>
      <Textarea
        id="bio"
        placeholder="Tell us about yourself..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <h2 className="text-lg font-semibold">Social Media URLs</h2>
      <p className="text-gray-500 text-sm">
        Add links to your website, blog, or social media profiles.
      </p>

      {socialLinks.map((link, index) => (
        <KeyValueInput
          key={index}
          index={index}
          value={link}
          onChange={handleSocialLinkChange}
        />
      ))}

      <Button variant="outline" onClick={addSocialLink}>
        Add URL
      </Button>

      <Button className="w-full md:w-auto px-6 py-3" onClick={handleSubmit}>
        Update Profile
      </Button>
    </Card>
  );
};

export default UpdateProfile;
