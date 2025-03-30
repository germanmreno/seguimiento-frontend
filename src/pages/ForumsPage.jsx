import { useEffect, useState } from "react";
import { Layout } from "../layout/Layout";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Lock, MessageCircle, Building, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Calculate pagination
  const indexOfLastForum = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstForum = indexOfLastForum - ITEMS_PER_PAGE;
  const currentForums = filteredForums.slice(indexOfFirstForum, indexOfLastForum);
  const totalPages = Math.ceil(filteredForums.length / ITEMS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedUrgency, selectedDate]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <div className="container mx-auto py-4 md:py-6 px-4 md:px-6">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-primary-blue">Foros de Discusión</h2>
            <Badge variant="outline" className="px-3 py-1 self-start md:self-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Badge>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

        {/* Forums List */}
        <div className="space-y-4 mt-4 md:mt-6">
          {currentForums.map((forum) => {
            const urgencyLevel = forum.memoDetails?.urgencyLevel || 'NORMAL';
            const urgencyVariant = urgencyOptions.find(
              option => option.id === urgencyLevel.toUpperCase()
            )?.variant || 'default';

            return (
              <Card
                key={forum.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4"
                onClick={() => navigate(`/forums/${forum.id}`)}
              >
                <div className="flex flex-col md:flex-row items-start p-4 gap-4">
                  {/* Left side: Main info */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <h3 className="text-base md:text-lg font-semibold text-primary-blue">
                        {forum.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={urgencyVariant}>
                          {urgencyLevel}
                        </Badge>
                        {forum.status === 'CLOSED' && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            Cerrado
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {forum.description}
                    </p>

                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">
                        Memo: {forum.memo_id.toUpperCase()}
                      </Badge>
                      {forum.memoDetails?.instruction && (
                        <Badge variant="outline" className="bg-gray-50">
                          {forum.memoDetails.instruction}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Right side: Stats & Dates */}
                  <div className="flex flex-row md:flex-col items-start md:items-end gap-2 w-full md:w-auto md:min-w-[200px]">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MessageCircle className="h-4 w-4" />
                      <span>{forum.messageCount} mensajes</span>
                    </div>

                    <div className="text-xs text-gray-500">
                      Creado: {new Date(forum.createdAt).toLocaleDateString()}
                    </div>

                    {forum.lastMessageAt && (
                      <div className="text-xs text-primary-blue">
                        Último mensaje: {new Date(forum.lastMessageAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 md:gap-2 mt-6 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "w-8 h-8",
                    currentPage === page && "bg-primary-blue text-white"
                  )}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* No results message */}
          {filteredForums.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No se encontraron foros que coincidan con los filtros.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};