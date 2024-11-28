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
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex flex-col items-center">
      <span className="sm:hidden text-xs font-medium">
        {office.abrev || getInitials(office.name)}
      </span>

      <div className="hidden sm:flex flex-col items-center">
        <span className="text-xs font-medium">{office.name}</span>
        <span className="text-[10px] text-gray-600">
          ({office.abrev || getInitials(office.name)})
        </span>
      </div>
    </div>
  );
};

export const MemoTabs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const hasFullAccess =
    user.role === 'ADMIN' ||
    user.office_id === '110' || // SEGUIMIENTO Y CONTROL
    user.office_id === '101' || // VICEPRESIDENCIA
    user.office_id === '100';   // PRESIDENCIA

  const [currentTab, setCurrentTab] = useState(hasFullAccess ? 'all' : String(user.office_id));
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
        if (hasFullAccess) {
          const officesData = await memosService.getOffices();
          setOffices(officesData);
        } else {
          const officesData = await memosService.getOffices();
          const userOffice = officesData.find(office => office.id === user.office_id);
          if (userOffice) {
            setOffices([userOffice]);
            setCurrentTab(user.office_id);
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
  }, [user, hasFullAccess]);

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

      if (!hasFullAccess) {
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
    user.office_id === '100' || // PRESIDENCIA
    user.office_id === '110';   // SEGUIMIENTO Y CONTROL

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
      <div className="container mx-auto py-4 sm:py-10 px-2 sm:px-4">
        <div className="flex flex-col">
          <div className="bg-[#24387d] text-white rounded-t-lg w-full min-h-[48px] flex items-center justify-between p-2 sm:p-4">
            <h1 className="primary-text text-sm sm:text-base md:text-lg text-center w-full">
              CORRESPONDENCIAS DE LA CORPORACIÓN VENEZOLANA DE MINERÍA
            </h1>
          </div>

          {loading || loadingOffices ? (
            <Loader />
          ) : error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : (
            <Tabs
              defaultValue={hasFullAccess ? 'all' : String(user.office_id)}
              value={currentTab}
              onValueChange={handleTabChange}
              className="w-full border-x-2 border-b-2 border-gray"
            >
              <div className="bg-gray-100 px-2 py-3 sm:px-3 border-b border-gray min-h-[60px] sm:min-h-[70px]">
                <TabsList className="flex flex-nowrap sm:flex-wrap gap-1 sm:gap-2 bg-transparent 
                                   overflow-x-auto sm:overflow-x-visible h-full">
                  {hasFullAccess && (
                    <TabsTrigger
                      value="all"
                      className="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-sm 
                               rounded-md shadow-sm data-[state=active]:bg-[#24387d] 
                               data-[state=active]:text-white hover:bg-gray-100 
                               transition-colors bg-white h-full"
                    >
                      <span className="sm:hidden">TODO</span>
                      <span className="hidden sm:block">TODOS</span>
                    </TabsTrigger>
                  )}

                  {canSeePendingTab && (
                    <TabsTrigger
                      value="pending"
                      className="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-sm 
                               rounded-md shadow-sm data-[state=active]:bg-[#24387d] 
                               data-[state=active]:text-white hover:bg-gray-100 
                               transition-colors bg-white relative"
                    >
                      <div className="flex items-center gap-1">
                        <span className="sm:hidden">PEND</span>
                        <span className="hidden sm:block">PENDIENTES</span>
                        {pendingCount > 0 && (
                          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 
                                         bg-red-500 text-white text-[8px] sm:text-xs 
                                         rounded-full w-3 h-3 sm:w-5 sm:h-5 
                                         flex items-center justify-center">
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
                      disabled={!hasFullAccess && office.id !== user.office_id}
                      className="flex-shrink-0 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-sm 
                               rounded-md shadow-sm data-[state=active]:bg-[#24387d] 
                               data-[state=active]:text-white hover:bg-gray-100 
                               transition-colors bg-white"
                    >
                      <TabHeader office={office} />
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="mt-4 px-2 sm:px-4">
                {canSeePendingTab && (
                  <TabsContent value="pending" className="min-w-full">
                    <div className="overflow-x-auto">
                      <DataTable
                        columns={columns({ navigate, toast, setRefresh })}
                        data={getFilteredMemos('pending')}
                      />
                    </div>
                  </TabsContent>
                )}
                {hasFullAccess && (
                  <TabsContent value="all" className="min-w-full">
                    <div className="overflow-x-auto">
                      <DataTable
                        columns={columns({ navigate, toast, setRefresh })}
                        data={getFilteredMemos('all')}
                      />
                    </div>
                  </TabsContent>
                )}
                {offices.map(office => (
                  <TabsContent key={office.id} value={String(office.id)} className="min-w-full">
                    <div className="overflow-x-auto">
                      <DataTable
                        columns={columns({ navigate, toast, setRefresh })}
                        data={getFilteredMemos(office.id)}
                      />
                    </div>
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