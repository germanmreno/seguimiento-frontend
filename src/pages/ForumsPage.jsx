import { useEffect, useState } from "react";
import { Layout } from "../layout/Layout";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Lock, MessageCircle, Building, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/custom";
import { urgencyOptions } from "@/options/formOptions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { forumsService } from "@/services/forums.service";

export const ForumsPage = () => {
  const [forums, setForums] = useState([]);
  const [filteredForums, setFilteredForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize filter states with "all"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchAllForums = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const forumsData = await forumsService.getAllForumsWithMessages(userData);
        console.log('Forums data from service:', forumsData); // Debug log
        setForums(forumsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching forums:', error);
        setLoading(false);
      }
    };

    fetchAllForums();
  }, []);

  useEffect(() => {
    setFilteredForums(forums);
  }, [forums]);

  useEffect(() => {
    let result = [...forums];

    // Search filter
    if (searchTerm) {
      result = result.filter(forum =>
        forum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        forum.memo_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        forum.memoDetails?.instruction?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      result = result.filter(forum => forum.status === selectedStatus);
    }

    // Urgency filter
    if (selectedUrgency !== "all") {
      result = result.filter(forum =>
        forum.memoDetails?.urgencyLevel?.toUpperCase() === selectedUrgency
      );
    }

    // Date filter
    if (selectedDate) {
      const selectedDateStr = selectedDate.toDateString();
      result = result.filter(forum => {
        const forumDate = new Date(forum.createdAt).toDateString();
        return forumDate === selectedDateStr;
      });
    }

    setFilteredForums(result);
  }, [forums, searchTerm, selectedStatus, selectedUrgency, selectedDate]);

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div className="container mx-auto py-10">
        {/* Filters Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary-blue">Foros de Discusión</h2>
              <Badge variant="outline" className="px-3 py-1">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Search Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por título, memo o instrucción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Estado</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="OPEN">Abierto</SelectItem>
                    <SelectItem value="CLOSED">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Urgency Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Urgencia</Label>
                <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                    <SelectValue placeholder="Todas las urgencias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las urgencias</SelectItem>
                    {urgencyOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-gray-50 border-gray-200 hover:bg-white transition-colors",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {/* Forums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForums.map((forum) => {
            // Safely access urgency level with fallback
            const urgencyLevel = forum.memoDetails?.urgencyLevel || 'NORMAL';

            const urgencyVariant = urgencyOptions.find(
              option => option.id === urgencyLevel.toUpperCase()
            )?.variant || 'default';

            return (
              <Card
                key={forum.id}
                className={cn(
                  "cursor-pointer hover:shadow-lg transition-shadow duration-200",
                  "border-2",
                  forum.status === 'CLOSED' ? "border-red-500/50" : "border-primary-blue/50"
                )}
                onClick={() => navigate(`/forums/${forum.id}`)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-primary-blue">
                      {forum.title}
                    </CardTitle>
                    {forum.status === 'CLOSED' && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Cerrado
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        Memo: <Badge variant="outline">{forum.memo_id.toUpperCase()}</Badge>
                      </div>
                      {urgencyLevel && (
                        <Badge variant={urgencyVariant} className="ml-2">
                          {urgencyLevel}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <div className="flex flex-wrap gap-1">
                        {forum.relatedOffices.map((office) => (
                          <Badge
                            key={office.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {office.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {forum.memoDetails?.instruction && (
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="bg-gray-50 text-gray-600">
                          Instrucción: {forum.memoDetails.instruction}
                        </Badge>
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {forum.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{forum.messageCount} mensajes</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Creado: {new Date(forum.createdAt).toLocaleDateString()}</span>
                    </div>
                    {forum.lastMessageAt && (
                      <div className="flex items-center gap-1 text-primary-blue">
                        <Clock className="h-4 w-4" />
                        <span>
                          Último mensaje: {new Date(forum.lastMessageAt).toLocaleDateString()} {new Date(forum.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};