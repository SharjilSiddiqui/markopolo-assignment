import Upload from "./components/Upload";
import Gallery from "./components/Gallery";

export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px" }}>
      <h1>Mini Image Gallery</h1>

      <Upload />

      <hr />

      <Gallery />
    </div>
  );
}
