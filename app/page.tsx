export default function Home() {
  return (
    <main>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.href='/dashboard'`,
        }}
      />
    </main>
  );
}