import { useState } from 'react';
import './App.css';

type PokemonData = {
  name: string;
  height: number;
  weight: number;
  sprites: { front_default: string | null };
  types?: { type: { name: string } }[];
};

export default function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<PokemonData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function buscarPokemon() {
    const nome = query.trim().toLowerCase();
    if (!nome) {
      setError("Digite um nome primeiro!");
      setData(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
      if (!res.ok) {
        setError("Pokémon não encontrado!");
        setData(null);
        setLoading(false);
        return;
      }

      const json = await res.json();
      setData({
        name: json.name,
        height: json.height,
        weight: json.weight,
        sprites: { front_default: json.sprites.front_default },
        types: json.types,
      });
    } catch {
      setError("Erro ao buscar. Tente novamente.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  function toggleTheme() {
    setDark((d) => !d);
    document.documentElement.setAttribute("data-theme", dark ? "light" : "dark");
  }

  return (
    <div className="app-root">
      {/* HEADER */}
      <header className="topbar">
        <div className="nav-container">
          <div className="brand">Pokédex</div>
          <nav className={`nav ${menuOpen ? "open" : ""}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>Casa</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>Sobre</a>
            <a href="#tips" onClick={() => setMenuOpen(false)}>Dicas</a>
          </nav>
        </div>

        <div className="controls">
          <button className="icon-btn" onClick={toggleTheme}>
            {dark ? "🌞" : "🌙"}
          </button>
          <button className={`hamburger ${menuOpen ? "is-active" : ""}`} onClick={() => setMenuOpen((s) => !s)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="container" id="home">
        {/* CASA / HOME */}
        <section className="search-card">
          <h1 className="title">Bem-vindo à Pokédex</h1>
          <p>Use a barra abaixo para buscar informações de qualquer Pokémon!</p>
          <div className="search-row">
            <input
              type="text"
              placeholder="Ex: pikachu"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscarPokemon()}
            />
            <button onClick={buscarPokemon}>{loading ? "Buscando..." : "Buscar"}</button>
          </div>
          {error && <p className="erro">{error}</p>}
        </section>

        {/* RESULTADO */}
        <section className="result-grid">
          {data ? (
            <article className="pokemon-card animate-in">
              <div className="poke-img-wrap">
                {data.sprites.front_default ? (
                  <img src={data.sprites.front_default} alt={data.name} />
                ) : (
                  <div className="no-img">Sem imagem</div>
                )}
              </div>
              <div className="poke-body">
                <h2>{data.name.toUpperCase()}</h2>
                <p><strong>Altura:</strong> {data.height}</p>
                <p><strong>Peso:</strong> {data.weight}</p>
                {data.types && (
                  <p className="types">
                    {data.types.map((t, i) => (
                      <span key={i} className="type">{t.type.name}</span>
                    ))}
                  </p>
                )}
              </div>
            </article>
          ) : (
            <div className="placeholder-card animate-in">
              <p>Pesquise um Pokémon para ver a ficha aqui.</p>
            </div>
          )}
        </section>

        {/* SOBRE */}
        <section id="about" className="about-card">
          <h2>Sobre</h2>
          <p>Este é um projeto de Pokédex feito para demonstrar React, TypeScript e consumo de APIs.</p>
          <p>Você pode buscar qualquer Pokémon pelo nome e ver suas informações, incluindo altura, peso e tipos.</p>
        </section>

        {/* DICAS */}
        <section id="tips" className="tips-card">
          <h2>Dicas</h2>
          <ul>
            <li>Use hooks para estado (useState) e efeitos (useEffect) quando necessário.</li>
            <li>Trate erros e loading para melhorar a experiência do usuário.</li>
            <li>Mantenha CSS modular e componha com classes reutilizáveis.</li>
          </ul>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <small>Desenvolvido por Richard Moura - Projeto para Portfólio.</small>
      </footer>
    </div>
  );
}
