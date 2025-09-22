"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Bell, 
  Home, 
  Shield, 
  Search, 
  User, 
  Upload, 
  Check, 
  X, 
  AlertTriangle,
  Zap,
  Power,
  AlertCircle
} from "lucide-react";

// Types
type UserRole = 'admin' | 'worker' | 'community';
type PoleStatus = 'online' | 'offline' | 'warning' | 'critical';
type AlertType = 'power_outage' | 'physical_damage' | 'maintenance_required' | 'other';

interface Pole {
  id: string;
  name: string;
  status: PoleStatus;
  location: string;
  lastUpdated: string;
  subPoles?: Pole[];
}

interface Alert {
  id: string;
  poleId: string;
  poleName: string;
  type: AlertType;
  description: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Mock data
const mockPoles: Pole[] = [
  {
    id: "1",
    name: "Main Distribution Pole A",
    status: "online",
    location: "Downtown",
    lastUpdated: "2023-05-15T14:30:00Z",
    subPoles: [
      {
        id: "1-1",
        name: "Sub Pole A1",
        status: "warning",
        location: "Street 1",
        lastUpdated: "2023-05-15T14:25:00Z"
      },
      {
        id: "1-2",
        name: "Sub Pole A2",
        status: "online",
        location: "Street 2",
        lastUpdated: "2023-05-15T14:30:00Z"
      }
    ]
  },
  {
    id: "2",
    name: "Main Distribution Pole B",
    status: "critical",
    location: "Uptown",
    lastUpdated: "2023-05-15T13:45:00Z",
    subPoles: [
      {
        id: "2-1",
        name: "Sub Pole B1",
        status: "offline",
        location: "Street 3",
        lastUpdated: "2023-05-15T13:40:00Z"
      },
      {
        id: "2-2",
        name: "Sub Pole B2",
        status: "online",
        location: "Street 4",
        lastUpdated: "2023-05-15T14:00:00Z"
      }
    ]
  },
  {
    id: "3",
    name: "Main Distribution Pole C",
    status: "online",
    location: "Midtown",
    lastUpdated: "2023-05-15T15:15:00Z",
    subPoles: [
      {
        id: "3-1",
        name: "Sub Pole C1",
        status: "online",
        location: "Street 5",
        lastUpdated: "2023-05-15T15:10:00Z"
      },
      {
        id: "3-2",
        name: "Sub Pole C2",
        status: "warning",
        location: "Street 6",
        lastUpdated: "2023-05-15T15:05:00Z"
      }
    ]
  }
];

const mockAlerts: Alert[] = [
  {
    id: "101",
    poleId: "1-1",
    poleName: "Sub Pole A1",
    type: "warning",
    description: "Voltage fluctuation detected",
    timestamp: "2023-05-15T14:25:00Z",
    status: "active"
  },
  {
    id: "102",
    poleId: "2",
    poleName: "Main Distribution Pole B",
    type: "critical",
    description: "Complete power outage",
    timestamp: "2023-05-15T13:45:00Z",
    status: "active"
  },
  {
    id: "103",
    poleId: "3-2",
    poleName: "Sub Pole C2",
    type: "maintenance_required",
    description: "Scheduled maintenance required",
    timestamp: "2023-05-15T15:05:00Z",
    status: "active"
  }
];

const mockUser: User = {
  id: "user1",
  name: "Admin User",
  email: "admin@jagratha.com",
  role: "admin"
};

export default function JagrathaDashboard() {
  // State management
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'alerts' | 'report'>('login');
  const [poles, setPoles] = useState<Pole[]>(mockPoles);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [newAlert, setNewAlert] = useState<Alert | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reportPoleId, setReportPoleId] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Simulate real-time updates
  useEffect(() => {
    if (isLoggedIn && currentPage === 'dashboard') {
      const interval = setInterval(() => {
        // Simulate status changes
        const updatedPoles = [...poles];
        const randomPoleIndex = Math.floor(Math.random() * updatedPoles.length);
        const statuses: PoleStatus[] = ['online', 'offline', 'warning', 'critical'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        updatedPoles[randomPoleIndex].status = randomStatus;
        updatedPoles[randomPoleIndex].lastUpdated = new Date().toISOString();
        
        setPoles(updatedPoles);
        
        // Simulate new alert
        if (Math.random() > 0.7) {
          const newAlert: Alert = {
            id: `alert-${Date.now()}`,
            poleId: updatedPoles[randomPoleIndex].id,
            poleName: updatedPoles[randomPoleIndex].name,
            type: randomStatus === 'critical' ? 'critical' : 'warning',
            description: `New ${randomStatus} status detected`,
            timestamp: new Date().toISOString(),
            status: 'active'
          };
          
          setAlerts(prev => [newAlert, ...prev]);
          setNewAlert(newAlert);
          setIsNotificationOpen(true);
        }
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, currentPage, poles]);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call Supabase auth
    setCurrentUser(mockUser);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  // Handle report submission
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to backend
    alert("Report submitted successfully!");
    setReportPoleId("");
    setReportDescription("");
    setCurrentPage('dashboard');
  };

  // Get status color
  const getStatusColor = (status: PoleStatus) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-300';
    }
  };

  // Get status icon
  const getStatusIcon = (status: PoleStatus) => {
    switch (status) {
      case 'online': return <Zap className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'offline': return <Power className="h-4 w-4 text-gray-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  // Filter poles based on search term
  const filteredPoles = poles.filter(pole => 
    pole.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pole.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pole.subPoles?.some(subPole => 
      subPole.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subPole.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? false)
  );

  // Render login page
  if (currentPage === 'login' || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-100 p-3 rounded-full mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Jagratha</CardTitle>
            <CardDescription>Electric Pole Monitoring System</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-500">
              Demo credentials: admin@jagratha.com / password
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render main dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Popup - Custom implementation */}
      {isNotificationOpen && newAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center">
                  <Bell className="h-5 w-5 text-red-500 mr-2" />
                  New Alert
                </h3>
                <button 
                  onClick={() => setIsNotificationOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-2 p-3 bg-red-50 rounded-md">
                <p className="font-medium">{newAlert.poleName}</p>
                <p className="text-sm">{newAlert.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(newAlert.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setIsNotificationOpen(false)}>Dismiss</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">Jagratha</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {alerts.filter(a => a.status === 'active').length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <span className="ml-2 text-sm font-medium hidden md:inline">{currentUser?.name}</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Button 
                variant={currentPage === 'dashboard' ? 'default' : 'ghost'} 
                onClick={() => setCurrentPage('dashboard')}
                className="flex items-center"
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button 
                variant={currentPage === 'alerts' ? 'default' : 'ghost'} 
                onClick={() => setCurrentPage('alerts')}
                className="flex items-center"
              >
                <Bell className="mr-2 h-4 w-4" />
                Alerts
                {alerts.filter(a => a.status === 'active').length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {alerts.filter(a => a.status === 'active').length}
                  </span>
                )}
              </Button>
              <Button 
                variant={currentPage === 'report' ? 'default' : 'ghost'} 
                onClick={() => setCurrentPage('report')}
                className="flex items-center"
              >
                <Upload className="mr-2 h-4 w-4" />
                Report Issue
              </Button>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search poles..."
                  className="pl-8 w-48 md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Dashboard Page */}
        {currentPage === 'dashboard' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Pole Status Overview</h2>
              <p className="text-gray-600">Real-time monitoring of electric poles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="rounded-full bg-green-100 p-3">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Online Poles</p>
                      <p className="text-2xl font-semibold">
                        {poles.flatMap(p => [p, ...(p.subPoles || [])]).filter(p => p.status === 'online').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="rounded-full bg-yellow-100 p-3">
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Warning</p>
                      <p className="text-2xl font-semibold">
                        {poles.flatMap(p => [p, ...(p.subPoles || [])]).filter(p => p.status === 'warning').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="rounded-full bg-red-100 p-3">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Critical</p>
                      <p className="text-2xl font-semibold">
                        {poles.flatMap(p => [p, ...(p.subPoles || [])]).filter(p => p.status === 'critical').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="rounded-full bg-gray-100 p-3">
                      <Power className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Offline</p>
                      <p className="text-2xl font-semibold">
                        {poles.flatMap(p => [p, ...(p.subPoles || [])]).filter(p => p.status === 'offline').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Pole Hierarchy</CardTitle>
                    <CardDescription>Current status of all poles and sub-poles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredPoles.map((pole) => (
                        <div key={pole.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className={`h-3 w-3 rounded-full ${getStatusColor(pole.status)} mr-2`}></div>
                              <h3 className="font-medium">{pole.name}</h3>
                            </div>
                            <span className="text-sm text-gray-500">{pole.location}</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-500 flex items-center">
                            <span className="mr-2">{getStatusIcon(pole.status)}</span>
                            Last updated: {new Date(pole.lastUpdated).toLocaleString()}
                          </div>
                          
                          {pole.subPoles && pole.subPoles.length > 0 && (
                            <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-3">
                              {pole.subPoles
                                .filter(subPole => 
                                  subPole.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  subPole.location.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((subPole) => (
                                  <div key={subPole.id} className="flex justify-between items-center">
                                    <div className="flex items-center">
                                      <div className={`h-2 w-2 rounded-full ${getStatusColor(subPole.status)} mr-2`}></div>
                                      <span>{subPole.name}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500">
                                      <span className="mr-2">{getStatusIcon(subPole.status)}</span>
                                      <span>{subPole.location}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Alerts</CardTitle>
                    <CardDescription>Latest issues detected</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {alerts
                        .filter(alert => alert.status === 'active')
                        .slice(0, 5)
                        .map((alert) => (
                          <div key={alert.id} className="border-l-4 border-red-500 pl-3 py-1">
                            <p className="font-medium">{alert.poleName}</p>
                            <p className="text-sm text-gray-600">{alert.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setCurrentPage('alerts')}
                    >
                      View All Alerts
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Poles</span>
                        <span className="font-medium">
                          {poles.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sub Poles</span>
                        <span className="font-medium">
                          {poles.reduce((acc, pole) => acc + (pole.subPoles?.length || 0), 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Alerts</span>
                        <span className="font-medium text-red-600">
                          {alerts.filter(a => a.status === 'active').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>System Uptime</span>
                        <span className="font-medium">99.8%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Page */}
        {currentPage === 'alerts' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Alert Management</h2>
              <p className="text-gray-600">All active and resolved alerts</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Real-time monitoring of system alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pole</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">{alert.poleName}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                            alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            alert.type === 'maintenance_required' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {alert.type.replace('_', ' ')}
                          </span>
                        </TableCell>
                        <TableCell>{alert.description}</TableCell>
                        <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            alert.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {alert.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {alert.status === 'active' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setAlerts(alerts.map(a => 
                                  a.id === alert.id ? {...a, status: 'resolved'} : a
                                ));
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Report Issue Page */}
        {currentPage === 'report' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Report an Issue</h2>
              <p className="text-gray-600">Submit a report about a pole problem</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Issue Report Form</CardTitle>
                <CardDescription>Fill out the form to report a problem</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReportSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="pole">Select Pole</Label>
                    <Select value={reportPoleId} onValueChange={setReportPoleId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pole" />
                      </SelectTrigger>
                      <SelectContent>
                        {poles.flatMap(pole => [
                          <SelectItem key={pole.id} value={pole.id}>
                            {pole.name}
                          </SelectItem>,
                          ...(pole.subPoles?.map(subPole => (
                            <SelectItem key={subPole.id} value={subPole.id}>
                              &nbsp;&nbsp;└ {subPole.name}
                            </SelectItem>
                          )) || [])
                        ])}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the issue in detail..."
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      required
                      rows={5}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setCurrentPage('dashboard')}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Report
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="ml-2 text-lg font-bold">Jagratha</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:order-1">
              <p className="text-center text-sm text-gray-500">
                &copy; 2023 Jagratha Electric Pole Monitoring System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}