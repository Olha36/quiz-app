export default function Home() {
  async function fetchData() {
    const res = await fetch(
      "https://cdn.contentful.com/spaces/aiytij8vnp0s/environments/master/entries?content_type=step&order=fields.stepOrder",
      {
        headers: {
          Authorization: "Bearer tU-Hi9LxIvOmI76fSyesAnHFn1pf3PKG5PJmvyW3-Ck",
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error("Request failed:", res.status, res.statusText);
      return;
    }

    const data = await res.json();
    console.log("data", data);
  }

  fetchData();
  return <div>Test</div>;
}
