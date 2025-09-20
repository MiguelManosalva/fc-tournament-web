import { useState, useEffect } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Tabs,
  Tab,
  Card,
  CardBody
} from '@heroui/react';
import { TournamentCreator } from './components/organisms/TournamentCreator';
import { TournamentView } from './components/organisms/TournamentView';
import { PlayerManager } from './components/molecules/PlayerManager';
import { TournamentCard } from './components/atoms/TournamentCard';
import { ThemeToggle } from './components/atoms/ThemeToggle';
import { useTournamentStore } from './stores/tournamentStore';
import { usePlayerStore } from './stores/playerStore';

type AppTab = 'current' | 'create' | 'history' | 'players';

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('current');
  const {
    tournaments,
    loadTournaments,
    loadCurrentTournament,
    setCurrentTournament,
    deleteTournament
  } = useTournamentStore();
  const { loadPlayers } = usePlayerStore();

  useEffect(() => {
    loadTournaments();
    loadCurrentTournament();
    loadPlayers();
  }, [loadTournaments, loadCurrentTournament, loadPlayers]);

  const handleTournamentCreated = () => {
    loadTournaments();
    loadCurrentTournament();
    setActiveTab('current');
  };

  const handleSelectTournament = (tournamentId: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (tournament) {
      setCurrentTournament(tournament);
      setActiveTab('current');
    }
  };

  const handleDeleteTournament = (tournamentId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este torneo?')) {
      deleteTournament(tournamentId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-content1 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-secondary rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-success rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <Navbar
        isBordered
        className="backdrop-blur-xl bg-background/70 border-b border-divider/50 sticky top-0 z-50"
        classNames={{
          wrapper: "px-4 sm:px-6 lg:px-8",
        }}
      >
        <NavbarBrand>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative group">
              <span className="text-2xl sm:text-3xl animate-pulse group-hover:animate-bounce transition-all duration-300">⚽</span>
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-x">
              <span className="hidden sm:inline">Gestor de Torneos FIFA</span>
              <span className="sm:hidden">FIFA Torneos</span>
            </h1>
          </div>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem className="hidden md:flex">
            <p className="text-sm text-foreground-600 font-medium">
              Organiza tus torneos de FIFA fácilmente
            </p>
          </NavbarItem>
          <NavbarItem>
            <ThemeToggle />
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <div className="relative">
          {/* Improved background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-secondary/3 rounded-3xl blur-3xl"></div>

          {/* Enhanced Tabs */}
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as AppTab)}
            size="lg"
            color="primary"
            className="mb-6 sm:mb-8 relative z-10"
            classNames={{
              tabList: "gap-2 w-full relative rounded-2xl bg-background/80 backdrop-blur-xl p-1 shadow-xl border border-divider/30",
              cursor: "bg-gradient-to-r from-primary via-secondary to-primary shadow-xl rounded-xl",
              tab: "px-3 py-2 font-semibold text-sm transition-all duration-300",
              tabContent: "group-data-[selected=true]:text-white"
            }}
          >
          <Tab key="current" title="🏆 Torneo Actual">
            <div>
              <TournamentView />
            </div>
          </Tab>

          <Tab key="create" title="➕ Crear Torneo">
            <div>
              <TournamentCreator onTournamentCreated={handleTournamentCreated} />
            </div>
          </Tab>

          <Tab key="history" title="📋 Historial">
            <div>
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Historial de Torneos
                  </h2>
                  <div className="flex items-center gap-2 px-4 py-2 bg-content1 rounded-full border border-divider/30">
                    <span className="text-primary font-bold text-lg">{tournaments.length}</span>
                    <p className="text-foreground-600 text-sm font-medium">
                      torneo{tournaments.length !== 1 ? 's' : ''} en total
                    </p>
                  </div>
                </div>

                {tournaments.length === 0 ? (
                  <Card className="bg-gradient-to-br from-content1 to-content2 border border-divider/50 shadow-xl">
                    <CardBody className="p-8 sm:p-12 text-center">
                      <div className="text-6xl sm:text-8xl mb-6 animate-bounce">🏆</div>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ¡Tu primer torneo te espera!
                      </h3>
                      <p className="text-foreground-600 mb-6 text-lg max-w-md mx-auto">
                        Comienza la diversión creando tu primer torneo de FIFA y compite con tus amigos.
                      </p>
                      <Button
                        color="primary"
                        size="lg"
                        variant="shadow"
                        onPress={() => setActiveTab('create')}
                        className="bg-gradient-to-r from-primary to-secondary font-bold text-white transform hover:scale-105 transition-transform px-8 py-3"
                        startContent="🚀"
                      >
                        Crear Tu Primer Torneo
                      </Button>
                    </CardBody>
                  </Card>
                ) : (
                  <div className="grid gap-4 sm:gap-6">
                    {tournaments
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((tournament, index) => (
                        <div
                          key={tournament.id}
                          className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <TournamentCard
                            tournament={tournament}
                            onSelect={() => handleSelectTournament(tournament.id)}
                            onDelete={() => handleDeleteTournament(tournament.id)}
                            selectable={true}
                          />
                        </div>
                      ))}
                  </div>
              )}
              </div>
            </div>
          </Tab>

          <Tab key="players" title="👥 Jugadores">
            <div>
              <div className="max-w-4xl mx-auto">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Gestión de Jugadores
                  </h2>
                  <p className="text-foreground-600">
                    Gestiona tu lista de jugadores. Agrega, edita o elimina jugadores aquí.
                  </p>
                </div>
                <PlayerManager />
              </div>
            </div>
          </Tab>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-divider/30 mt-16 py-8 bg-gradient-to-r from-background/90 to-content1/90 backdrop-blur-xl relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-t-3xl"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-xl animate-pulse">⚽</span>
            <p className="text-sm sm:text-base font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Gestor de Torneos FIFA
            </p>
            <span className="text-xl animate-pulse delay-500">🏆</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground-500 mb-2">
            Organiza tus torneos de FIFA con facilidad
          </p>
          <p className="text-xs text-foreground-400 flex items-center justify-center gap-2 flex-wrap">
            <span>Desarrollado con</span>
            <span className="text-primary font-medium">React</span>
            <span>•</span>
            <span className="text-secondary font-medium">TypeScript</span>
            <span>•</span>
            <span className="text-success font-medium">Zustand</span>
            <span>•</span>
            <span className="text-warning font-medium">HeroUI</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
