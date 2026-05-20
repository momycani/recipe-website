function CreateCanningRecipe() {
  return (
    <main className="kitchen-subpage">
      <section className="kitchen-subpage-header">
        <p className="kitchen-eyebrow">Canning Recipes</p>
        <h1>Add a canning recipe.</h1>

        <p>
          This page will let you save canning recipes with ingredients,
          processing notes, jar size, method, headspace, and safety reminders.
        </p>
      </section>

      <section className="safe-canning-note">
        <h2>Coming Next</h2>
        <p>
          We’ll build this form carefully so it stores canning details without
          presenting unverified processing instructions as safety advice.
        </p>
      </section>
    </main>
  );
}

export default CreateCanningRecipe;