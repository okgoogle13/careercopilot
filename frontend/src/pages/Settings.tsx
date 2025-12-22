import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { User, Bell, Shield, Trash2, Globe } from 'lucide-react';

export default function Settings() {
    const [notifications, setNotifications] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <div className="relative">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-2 text-[#E6E1E5] tracking-tight leading-[1.1]">
                    Settings
                </h1>
                <p className="text-[#CAC4D0]">Manage your account preferences and application settings</p>
            </div>

            <div className="space-y-8 max-w-[1000px]">
                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            <CardTitle className="font-heading text-xl">Profile Information</CardTitle>
                        </div>
                        <CardDescription>Update your personal details and public profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" placeholder="Jane" defaultValue="Jane" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" placeholder="Doe" defaultValue="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="jane@example.com" defaultValue="jane.doe@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Input id="bio" placeholder="Software Engineer with 5 years experience..." />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t border-border/50 p-4">
                        <Button>Save Changes</Button>
                    </CardFooter>
                </Card>

                {/* Preferences */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            <CardTitle className="font-heading text-xl">Preferences</CardTitle>
                        </div>
                        <CardDescription>Customize your experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Dark Mode</Label>
                                <p className="text-sm text-muted-foreground">Enable dark mode for the interface.</p>
                            </div>
                            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                        </div>

                        <div className="space-y-2">
                            <Label>Language</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="en">English (US)</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            <CardTitle className="font-heading text-xl">Notifications</CardTitle>
                        </div>
                        <CardDescription>Configure how you receive alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive emails about your account activity.</p>
                            </div>
                            <Switch checked={notifications} onCheckedChange={setNotifications} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Marketing Emails</Label>
                                <p className="text-sm text-muted-foreground">Receive emails about new features and offers.</p>
                            </div>
                            <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t border-border/50 p-4">
                        <Button variant="outline">Reset Defaults</Button>
                    </CardFooter>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive/50 bg-destructive/10">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-destructive" />
                            <CardTitle className="font-heading text-xl text-destructive">Danger Zone</CardTitle>
                        </div>
                        <CardDescription className="text-destructive">Irreversible actions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-semibold">Delete Account</Label>
                                <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                            </div>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
