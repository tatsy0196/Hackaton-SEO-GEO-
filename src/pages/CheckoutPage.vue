<script setup lang="ts"></script>

<template>
  <section class="page">
    <h1>Commande</h1>
    <div class="checkout">
      <div class="summary">
        <h2>Votre panier</h2>
        <p>Total : <strong>0,00 €</strong></p>
      </div>
      <div class="form">
        <h2>Mode de retrait</h2>
        <div class="options">
          <label>
            <input type="radio" name="delivery" value="pickup" />
            Click & collect
          </label>
          <label>
            <input type="radio" name="delivery" value="relay" />
            Point relais
          </label>
        </div>
        <button class="confirm">Confirmer la commande</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem;
}
.checkout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.confirm {
  background: #1b5e20;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}
</style>
