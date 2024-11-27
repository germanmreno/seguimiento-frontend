import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/forums/data-table";
import { columns } from "@/forums/columns";
import { memosService } from "@/services/memos.service";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/layout/Layout";
import { Loader } from "@/components/custom";
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TabHeader = ({ office }) => {
  // Get initials if name is too long (e.g., "Gerencia de Administración" -> "GA")
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Show full name on larger screens, initials on mobile */}
      <span className="hidden md:block text-xs font-medium">{office.name}</span>
      <span className="md:hidden text-xs font-medium">{getInitials(office.name)}</span>
      <span className="text-[10px] text-gray-400">{office.abrev}</span>
    </div>
  );
};

export const MemoTabs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(user.role === 'ADMIN' ? 'all' : String(user.office_id));
  const [memos, setMemos] = useState([]);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOffices, setLoadingOffices] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const loadOffices = async () => {
      try {
        if (user.role === 'ADMIN') {
          const officesData = await memosService.getOffices();
          setOffices(officesData);
        } else {
          // For regular users, first get all offices to ensure we have the correct data
          const officesData = await memosService.getOffices();
          const userOffice = officesData.find(office => office.id === user.office_id);
          if (userOffice) {
            setOffices([userOffice]);
            setCurrentTab(user.office_id); // Ensure we set the correct tab
          } else {
            throw new Error('Oficina no encontrada');
          }
        }
      } catch (error) {
        setError(error.message);
        toast.error('Error al cargar las oficinas');
      } finally {
        setLoadingOffices(false);
      }
    };

    loadOffices();
  }, [user]);

  useEffect(() => {
    if (!loadingOffices) {
      fetchMemos(currentTab);
    }
  }, [loadingOffices, refresh, currentTab]);

  useEffect(() => {
    // Calculate pending count
    const count = memos.filter(memo => memo.instruction_status === 'PENDING').length;
    setPendingCount(count);
  }, [memos]);

  const fetchMemos = async (tabValue) => {
    try {
      setLoading(true);
      let params = {};

      if (tabValue === 'pending') {
        const memosData = await memosService.getAllMemosWithFilters(user, {});
        const pendingMemos = memosData.filter(memo =>
          memo?.instruction_status === 'PENDING'
        );
        setMemos(pendingMemos);
        setPendingCount(pendingMemos.length);
        return;
      }

      if (user?.role !== 'ADMIN') {
        params.office_id = user.office_id;
      } else if (tabValue !== 'all') {
        params.office_id = tabValue;
      }

      const memosData = await memosService.getAllMemosWithFilters(user, params);
      setMemos(memosData || []);
    } catch (error) {
      console.error('Error fetching memos:', error);
      setError(error.message);
      toast.error('Error al cargar los oficios');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value) => {
    setCurrentTab(value);
    fetchMemos(value);
  };

  const tabStyles = {
    default: "data-[state=active]:bg-[#24387d] data-[state=active]:text-white hover:bg-gray-100 transition-colors bg-white",
    separator: "mx-1",
    container: "bg-transparent p-1"
  };

  const canSeePendingTab =
    user.role === 'ADMIN' ||
    user.office_id === '101' || // VICEPRESIDENCIA
    user.office_id === '100';   // PRESIDENCIA

  const getFilteredMemos = (tabValue) => {
    if (!Array.isArray(memos)) return [];

    if (tabValue === 'pending') {
      return memos.filter(memo => memo?.instruction_status === 'PENDING');
    }
    if (tabValue === 'all') {
      return memos;
    }
    return memos.filter(memo =>
      memo?.offices?.some(office => office?.office_id === tabValue)
    );
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex flex-col">
          <div className="bg-[#24387d] text-white rounded-t-lg w-full h-12 flex items-center justify-between p-4">
            <h1 className="primary-text">
              CORRESPONDENCIAS DE LA CORPORACIÓN VENEZOLANA DE MINERÍA
            </h1>
          </div>

          {loading || loadingOffices ? (
            <Loader />
          ) : error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : (
            <Tabs
              defaultValue={user.role === 'ADMIN' ? 'all' : String(user.office_id)}
              value={currentTab}
              onValueChange={handleTabChange}
              className="w-full border-x-2 border-b-2 border-gray"
            >
              <div className="flex items-center justify-between bg-gray-100 p-2 overflow-x-auto">
                <TabsList className={`${tabStyles.container} h-auto gap-1 flex-wrap p-1`}>
                  {user.role === 'ADMIN' && (
                    <TabsTrigger
                      value="all"
                      className={`${tabStyles.default} ${tabStyles.separator} px-4 py-2 rounded-md shadow-sm`}
                    >
                      Todos
                    </TabsTrigger>
                  )}
                  {canSeePendingTab && (
                    <TabsTrigger
                      value="pending"
                      className={`${tabStyles.default} ${tabStyles.separator} px-4 py-2 rounded-md shadow-sm relative`}
                    >
                      <div className="flex items-center gap-2">
                        <span>PENDIENTES POR ASIGNAR</span>
                        {pendingCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {pendingCount}
                          </span>
                        )}
                      </div>
                    </TabsTrigger>
                  )}
                  {offices.map(office => (
                    <TabsTrigger
                      key={office.id}
                      value={String(office.id)}
                      disabled={user.role !== 'ADMIN' && office.id !== user.office_id}
                      className={`${tabStyles.default} ${tabStyles.separator} px-4 py-2 rounded-md shadow-sm`}
                    >
                      <TabHeader office={office} />
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="overflow-x-auto">
                {canSeePendingTab && (
                  <TabsContent value="pending">
                    <DataTable
                      columns={columns({ navigate, toast, setRefresh })}
                      data={getFilteredMemos('pending')}
                    />
                  </TabsContent>
                )}
                {user.role === 'ADMIN' && (
                  <TabsContent value="all">
                    <DataTable
                      columns={columns({ navigate, toast, setRefresh })}
                      data={getFilteredMemos('all')}
                    />
                  </TabsContent>
                )}
                {offices.map(office => (
                  <TabsContent key={office.id} value={String(office.id)}>
                    <DataTable
                      columns={columns({ navigate, toast, setRefresh })}
                      data={getFilteredMemos(office.id)}
                    />
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          )}
        </div>
      </div>
    </Layout>
  );
}; 