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


	let junctions: Pole[][] = structuredClone(originalJunctions);
	let actions: GameAction[] = [];
	let gameStage: GameStage = GameStage.PRE_GAME;
	let currentConeType: ConeType = ConeType.REGULAR;

	$: {
		console.debug("actions", actions);
		console.debug("junctions", junctions);

		switch (gameStage) {
			case GameStage.AUTO:
				currentConeType = ConeType.AUTO;
				break;
			case GameStage.TELEOP:
				currentConeType = ConeType.REGULAR;
				break;
		}

		renderBoard();
	}


	function addConeToPole(xCoordinate: number, yCoordinate: number, color: Alliance): void {
		console.log("addConeToPole", xCoordinate, yCoordinate);
		// if (gameStage === GameStage.PRE_GAME) {
		// 	window.alert("Game has not started yet");
		// 	return;
		// }

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


	<button on:click={undoAction}>Undo</button>
	<button on:click={renderBoard}>Render</button>
	<button on:click={() => {actions = []; window.alert("cleared!")}}>Clear</button>
	<button on:click={exportActions}>Export</button>

	<hr>

	<ul>
		<li>Pre Game</li>
	</ul>

	<hr>

	<h2>Recent Actions</h2>
	<table>
		<thead>
			<tr>
				<th>Color</th>
				<th>Coordinates</th>
			</tr>
		</thead>
		<tbody>
			{#each actions as action}
				<tr>
					<td>{Alliance[action.cone.color]}</td>
					<td>{action.cone.xCoordinate},{action.cone.yCoordinate}</td>
				</tr>
			{/each}
	</table>
</section>
