import { useEffect, useState } from "react";
import { Layout } from "../layout/Layout";
import axios from "axios";
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

export const ForumsPage = () => {
  const [forums, setForums] = useState([]);
  const [filteredForums, setFilteredForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize filter states with "all"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [offices, setOffices] = useState([]);

  // Fetch offices for filter
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/offices');
        setOffices(response.data);
      } catch (error) {
        console.error('Error fetching offices:', error);
      }
    };
    fetchOffices();
  }, []);

  useEffect(() => {
    const fetchAllForums = async () => {
      try {
        const memosResponse = await axios.get('http://localhost:3000/memos');
        const memos = memosResponse.data;

        const forumsPromises = memos.map(async (memo) => {
          try {
            const forumResponse = await axios.get(`http://localhost:3000/forums/check-existence/${memo.id}`);
            if (forumResponse.data.exists) {
              const fullForumResponse = await axios.get(`http://localhost:3000/forums/${forumResponse.data.id}`);
              const forumData = fullForumResponse.data;

              const messagesResponse = await axios.get(`http://localhost:3000/forums/${forumResponse.data.id}/messages`);

              return {
                ...forumData,
                messageCount: messagesResponse.data.length,
                lastMessageAt: forumResponse.data.lastMessageAt
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching forum for memo ${memo.id}:`, error);
            return null;
          }
        });

        const forumsResults = await Promise.all(forumsPromises);
        const validForums = forumsResults.filter(forum => forum !== null);
        setForums(validForums);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching forums:', error);
        setLoading(false);
      }
    };

    fetchAllForums();
  }, []);

  // Set initial filtered forums when forums are loaded
  useEffect(() => {
    setFilteredForums(forums);
  }, [forums]);

  // Apply filters effect
  useEffect(() => {
    let result = [...forums];

    // Search filter
    if (searchTerm) {
      result = result.filter(forum =>
        forum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        forum.memo_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Office filter
    if (selectedOffice && selectedOffice !== "all") {
      result = result.filter(forum =>
        forum.relatedOffices.some(office => office.id === selectedOffice)
      );
    }

    // Status filter
    if (selectedStatus && selectedStatus !== "all") {
      result = result.filter(forum => forum.status === selectedStatus);
    }

    // Urgency filter
    if (selectedUrgency && selectedUrgency !== "all") {
      result = result.filter(forum =>
        forum.memoDetails?.urgencyLevel?.toUpperCase() === selectedUrgency
      );
    }

    // Date filter
    if (selectedDate) {
      result = result.filter(forum => {
        const forumDate = new Date(forum.createdAt).toDateString();
        return forumDate === selectedDate.toDateString();
      });
    }

    setFilteredForums(result);
  }, [forums, searchTerm, selectedOffice, selectedStatus, selectedUrgency, selectedDate]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedOffice("all");
    setSelectedStatus("all");
    setSelectedUrgency("all");
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary-blue">Foros Activos</h1>
          <Button
            variant="outline"
            onClick={resetFilters}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por título o memo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Office Filter */}
            <div className="space-y-2">
              <Label>Oficina</Label>
              <Select value={selectedOffice} onValueChange={setSelectedOffice}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las oficinas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las oficinas</SelectItem>
                  {offices.map((office) => (
                    <SelectItem key={office.id} value={office.id}>
                      {office.abrev} - {office.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="OPEN">Abierto</SelectItem>
                  <SelectItem value="CLOSED">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Urgency Filter */}
            <div className="space-y-2">
              <Label>Urgencia</Label>
              <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                <SelectTrigger>
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
              <Label>Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
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

        {/* Forums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForums.map((forum) => {
            const urgencyVariant = urgencyOptions.find(
              option => option.id === forum.memoDetails?.urgencyLevel?.toUpperCase()
            )?.variant;

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
                      {forum.memoDetails?.urgencyLevel && (
                        <Badge variant={urgencyVariant} className="ml-2">
                          {forum.memoDetails.urgencyLevel}
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