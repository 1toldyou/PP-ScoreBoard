<svelte:head>
	<title>PowerPlay Scoreboard</title>
	<meta name="description" content="better score-board for PowerPlay2022" />
</svelte:head>

<script lang="ts">
	import structuredClone from "@ungap/structured-clone";

	import type {Pole} from "$lib/pole";
	import {PoleHeight, getPoleCSS} from "$lib/pole";
	import {Alliance, ConeType} from "$lib/cone";
	import type {GameAction} from "$lib/game-action";
	import {GameStage} from "$lib/game-action";
	import {originalJunctions} from "$lib/data";
	import type {Scoring} from "$lib/scoring";
	import {computeScore} from "$lib/scoring";


	let junctions: Pole[][] = structuredClone(originalJunctions);
	let actions: GameAction[] = [];
	let gameStage: GameStage = GameStage.PRE_GAME;
	let currentConeType: ConeType = ConeType.REGULAR;
	let score: Scoring = {
		blueTotal: 0,
		redTotal: 0,
		blueAutoConeScore: 0,
		redAutoConeScore: 0,
		blueTeleopConeScore: 0,
		redTeleopConeScore: 0,
	}

	$: {
		// console.debug("actions", actions);
		// console.debug("junctions", junctions);

		switch (gameStage) {
			case GameStage.AUTO:
				currentConeType = ConeType.AUTO;
				break;
			case GameStage.TELEOP:
				currentConeType = ConeType.REGULAR;
				break;
		}

		renderBoard();
		score = computeScore(actions);
	}


	function addConeToPole(xCoordinate: number, yCoordinate: number, color: Alliance): void {
		console.log("addConeToPole", xCoordinate, yCoordinate);
		if (gameStage === GameStage.PRE_GAME) {
			window.alert("Game has not started yet");
			return;
		}

		// for trigger reactivity
		actions = [
				...actions,
				{
					cone: {
						category: currentConeType,
						color: color,
						xCoordinate: xCoordinate,
						yCoordinate: yCoordinate,
					},
					pole: structuredClone(junctions[yCoordinate][xCoordinate]),
				}
		];
	}

	function undoAction(): void {
		console.log("undoAction()");
		if (actions.length == 0) {
			window.alert("No actions to undo");
			return;
		}
		actions = actions.slice(0, actions.length - 1);
	}

	function renderBoard(): void {
		console.log("render()");

		let newJunctions: Pole[][] = structuredClone(originalJunctions);

		for (let i = 0; i < actions.length; i++) {
			// console.log(`action i ${i} for pole ${actions[i].pole.xCoordinate}, ${actions[i].pole.yCoordinate}`);
			let currentPole = newJunctions[actions[i].pole.yCoordinate][actions[i].pole.xCoordinate];
			if (actions[i].cone.color === Alliance.BLUE) {
				currentPole.blueConeCount++;
			} else {
				currentPole.redConeCount++;
			}
			currentPole.cones.push(actions[i].cone);
			newJunctions[actions[i].pole.yCoordinate][actions[i].pole.xCoordinate] = currentPole;
		}

		junctions = structuredClone(newJunctions);
	}

	function exportActions(): void {
		let exportString = JSON.stringify(actions);
		console.log("exportActions", exportString);
	}

	function setGameStage(stage: GameStage): void {
		console.log("setGameStage", GameStage[stage]);
		gameStage = stage;
	}
</script>

<section>
	<div class="tile is-ancestor">
		<div class="field">
			{#each junctions as junctionRow, i}
				<div class="tile is-parent">
					{#each junctionRow as pole, j}
						<div class="tile is-child box">
							<!-- <div>▲</div> -->
							<p>
								({pole.xCoordinate},{pole.yCoordinate})
								{PoleHeight[pole.height]}
								Blue: {pole.blueConeCount}
								Red: {pole.redConeCount}
								{#if pole.cones.length < 0}
									{#each pole.cones as cone}
										<span>{cone.color}</span>
									{/each}
								{/if}
								<button on:click={() => addConeToPole(pole.xCoordinate, pole.yCoordinate, Alliance.BLUE)}>Add Blue</button>
								<button on:click={() => addConeToPole(pole.xCoordinate, pole.yCoordinate, Alliance.RED)}>Add Red</button>
							</p>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</section>

<hr>

<section class="has-text-centered">
	<button on:click={undoAction}>Undo</button>
	<button on:click={renderBoard}>Render</button>
	<button on:click={() => {actions = []; window.alert("cleared!")}}>Clear</button>
	<button on:click={exportActions}>Export</button>
</section>

<hr>

<section>
	<p class="has-text-centered">
		<span
				style={`${gameStage === GameStage.PRE_GAME? "text-decoration: underline" : ""}`}
				on:click={() => setGameStage(GameStage.PRE_GAME)}
				on:keypress={() => setGameStage(GameStage.PRE_GAME)}
		>
			Pre Game
		</span>
		<span
				style={`${gameStage === GameStage.AUTO? "text-decoration: underline" : ""}`}
				on:click={() => setGameStage(GameStage.AUTO)}
				on:keypress={() => setGameStage(GameStage.AUTO)}
		>
			Auto
		</span>
		<span
				style={`${gameStage === GameStage.TELEOP? "text-decoration: underline" : ""}`}
				on:click={() => setGameStage(GameStage.TELEOP)}
				on:keypress={() => setGameStage(GameStage.TELEOP)}
		>
			Teleop
		</span>
	</p>
</section>

<hr>

<section>
	<div class="table-container">
		<table class="table">
			<thead>
				<tr>
					<th>Category</th>
					<th>Red</th>
					<th>Blue</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Total</td>
					<td>{score.redTotal}</td>
					<td>{score.blueTotal}</td>
				</tr>
				<tr>
					<td>Auto Cone</td>
					<td>{score.redAutoConeScore}</td>
					<td>{score.blueAutoConeScore}</td>
				</tr>
				<tr>
					<td>TeleOp Cone</td>
					<td>{score.redTeleopConeScore}</td>
					<td>{score.blueTeleopConeScore}</td>
				</tr>
			</tbody>
		</table>
	</div>
</section>

<hr>

<section>
	<h2>Recent Actions</h2>
	<div class="table-container">
		<table class="table">
			<thead>
			<tr>
				<th>Coordinates</th>
				<th>Color</th>
				<th>Type</th>
			</tr>
			</thead>
			<tbody>
			{#each actions.slice(-10).reverse() as action}
				<tr>
					<td>({action.cone.xCoordinate}, {action.cone.yCoordinate})</td>
					<td>{Alliance[action.cone.color]}</td>
					<td>{ConeType[action.cone.category]}</td>
				</tr>
			{/each}
		</table>
	</div>
</section>
