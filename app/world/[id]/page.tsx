export default async function WorldPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div>
            <h1>World {id}</h1>
        </div>
    );
}