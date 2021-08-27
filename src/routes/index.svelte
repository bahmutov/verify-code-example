<svelte:head>
	<title>New User</title>
</svelte:head>

<script>
  // wait, are we reinventing state machines? Yes.
  export let state = 'NewUser'
  export let userId = null
  export let phoneNumber = null
  export let errorMessage = null

  // all our requests are JSON
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  async function submitNewUser(event) {
    const data = {
      username: event.target.username.value,
      email: event.target.email.value
    }
    const res = await fetch('/signup.json', {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json()
    // maybe grab the error
    userId = json.userId
    state = 'EnterPhone'
  }

  async function submitPhoneNumber(event) {
    phoneNumber = event.target.phone.value
    const data = {
      userId,
      phoneNumber
    }
    const res = await fetch('/phone.json', {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json()
    // maybe grab the error
    state = 'EnterSms'
  }

  async function submitSmsCode(event) {
    const data = {
      userId,
      phoneNumber,
      code: event.target.code.value,
    }
    const res = await fetch('/code.json', {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json()
    if (json.error) {
      errorMessage = json.error
      // remain at the same state
    } else {
      state = 'VerifiedPhone'
    }
  }
</script>

<div class="users signup">
  {#if state === 'NewUser'}
    <h2>New user signup</h2>
    <form on:submit|preventDefault="{submitNewUser}"
    >
      <input name="username" aria-label="Username" required placeholder="username" />
      <input name="email" aria-label="Email" required placeholder="email" />
      <button type="submit">Sign up</button>
    </form>
  {:else if state === 'EnterPhone'}
    <h2>Verify Phone</h2>
    <form on:submit|preventDefault="{submitPhoneNumber}"
    >
      <input name="phone" aria-label="Phone number" required placeholder="Enter your phone" />
      <button type="submit">Send me SMS</button>
    </form>
    <p>User ID {userId}</p>
  {:else if state === 'EnterSms'}
    <h2>Verify Phone</h2>
    <form on:submit|preventDefault="{submitSmsCode}"
    >
      <input name="code" aria-label="Verify code" required placeholder="Enter received code" />
      <button type="submit">Verify code</button>
    </form>
  {:else if state === 'VerifiedPhone'}
    <h1>Phone verified!</h1>
  {/if}

  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
  {/if}

</div>

<style>
	.users {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
		line-height: 1;
	}

	input {
		border: 1px solid transparent;
	}

	input:focus-visible {
		box-shadow: inset 1px 1px 6px rgba(0, 0, 0, 0.1);
		border: 1px solid #ff3e00 !important;
		outline: none;
	}

  .signup h2 {
    font-size: 28px;
    width: 100%;
    text-align: center;
  }

	.signup input {
		font-size: 28px;
		width: 100%;
		padding: 0.5em 1em 0.3em 1em;
    margin: 0.5em 0;
		box-sizing: border-box;
		background: aliceblue;
		border-radius: 8px;
		text-align: center;
	}

  .signup form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .signup button {
    font-size: 28px;
    padding: 0.25em 0.5em;
    border-radius: 0.5em;
    border-color:rgba(0, 0, 0, 0.1)
  }

  .error-message {
    color: red;
  }
</style>
